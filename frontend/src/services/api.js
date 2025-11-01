import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Set auth token
api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Restore token from localStorage
const storedToken = localStorage.getItem('access_token');
if (storedToken) {
  api.setAuthToken(storedToken);
}

// ==================== AUTO-REFRESH TOKEN LOGIC ====================

// Flag để tránh refresh token đồng thời nhiều lần
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor để tự động refresh token khi access token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        // Không có refresh token → logout
        console.log('🔐 No refresh token, logging out...');
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        console.log('🔄 Access token expired, refreshing...');
        
        // Gọi API refresh (không dùng interceptor để tránh loop)
        const response = await axios.post('http://localhost:3000/auth/refresh', {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Lưu token mới
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        // Update axios default headers
        api.setAuthToken(accessToken);

        console.log('✅ Token refreshed successfully');

        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError);
        processQueue(refreshError, null);
        
        // Clear storage and redirect to login
        localStorage.clear();
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu không phải lỗi 401, xử lý bình thường
    if (error.response?.status === 401) {
      console.log('🔐 Token expired, clearing storage...');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('current_user');
    }

    return Promise.reject(error);
  }
);

// ==================== API FUNCTIONS ====================

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const addUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// Forgot Password - hỗ trợ cả 2 API (cũ /password/forgot và mới /auth/forgot-password)
export const forgotPassword = async (email) => {
  // SV1: Sử dụng API mới /auth/forgot-password
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

// Reset Password - hỗ trợ cả 2 cách (token trong body hoặc URL)
export const resetPassword = async (token, newPassword, useUrlToken = false) => {
  if (useUrlToken) {
    // SV1: Sử dụng API mới với token trong URL /auth/resetpassword/:token
    const res = await api.post(`/auth/resetpassword/${token}`, { newPassword });
    return res.data;
  } else {
    // API cũ: token trong body /password/reset
    const res = await api.post('/password/reset', { token, newPassword });
    return res.data;
  }
};

export const uploadAvatar = async (formData) => {
  const res = await api.post('/avatar/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const removeAvatar = async () => {
  const res = await api.delete('/avatar/remove');
  return res.data;
};

// ==================== RBAC API FUNCTIONS ====================

// Cập nhật role của user (chỉ Admin)
export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data;
};

// Lấy danh sách admins/moderators
export const getAdmins = async () => {
  const res = await api.get('/users/admins');
  return res.data;
};

export default api;
