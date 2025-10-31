frontend-auth
import axios from "axios";

const api = axios.create({
 feature/refresh-token
  baseURL: "http://localhost:3000",

  baseURL: "http://localhost:3000", // ✅ Backend đang chạy ở cổng 3000

// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
main
main
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

 feature/refresh-token
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

frontend-auth
// Nếu có token trong localStorage thì set Authorization header
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
main
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

 feature/refresh-token
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

// (tuỳ chọn) Hiển thị lỗi

// (tuỳ chọn) Interceptor hiện alert khi lỗi:
 main
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err?.message);
frontend-profile
    if (err.response?.status === 401) {
      // Nếu token hết hạn hoặc không hợp lệ
      localStorage.removeItem('jwt_token');
      api.setAuthToken(null);
      window.location.reload();
    }

frontend-auth
    
    // Nếu là lỗi 401, clear token và redirect về login
    if (err?.response?.status === 401) {
      console.log("🔐 Token expired, clearing storage...");
      localStorage.removeItem('jwt_token');
main
      localStorage.removeItem('current_user');
    }
feature/refresh-token

    return Promise.reject(error);

    

main
main
    return Promise.reject(err);
main
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

feature/refresh-token
export const forgotPassword = async (email) => {
  const res = await api.post('/password/forgot', { email });
  return res.data;
};


 frontend-profile
export const getProfile = async () => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err);

// API cho quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const res = await api.post('/password/forgot', { email });
    return res.data;
  } catch (err) {
    console.error("Error sending forgot password:", err);
 main
    throw err;
  }
};

frontend-profile
export const updateProfile = async (profileData) => {
  try {
    const res = await api.put('/profile', profileData);
    return res.data;
  } catch (err) {
    console.error("Error updating profile:", err);

// API cho reset mật khẩu
 main
export const resetPassword = async (token, newPassword) => {
  const res = await api.post('/password/reset', { token, newPassword });
  return res.data;
};

export const uploadAvatar = async (formData) => {
  const res = await api.post('/avatar/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const removeAvatar = async () => {
feature/refresh-token
  const res = await api.delete('/avatar/remove');
  return res.data;

  try {
    const res = await api.delete('/avatar/remove');
    return res.data;
  } catch (err) {
    console.error("Error removing avatar:", err);
main
    throw err;
  }
 main
};

export default api;
