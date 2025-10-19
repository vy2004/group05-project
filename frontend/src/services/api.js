import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ✅ Backend đang chạy ở cổng 3000
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 giây
});

// Nếu có token trong localStorage thì set Authorization header
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
if (storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

api.setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
};

// (tuỳ chọn) Hiển thị lỗi
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err?.message);
    
    // Nếu là lỗi 401, clear token và redirect về login
    if (err?.response?.status === 401) {
      console.log("🔐 Token expired, clearing storage...");
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('current_user');
      // Không hiển thị alert để tránh spam
    }
    
    return Promise.reject(err);
  }
);

export const getUsers = async () => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

export const addUser = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    return res.data;
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

// API cho quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const res = await api.post('/password/forgot', { email });
    return res.data;
  } catch (err) {
    console.error("Error sending forgot password:", err);
    throw err;
  }
};

// API cho reset mật khẩu
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await api.post('/password/reset', { token, newPassword });
    return res.data;
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err;
  }
};

// API cho upload avatar
export const uploadAvatar = async (formData) => {
  try {
    const res = await api.post('/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error uploading avatar:", err);
    throw err;
  }
};

// API cho xóa avatar
export const removeAvatar = async () => {
  try {
    const res = await api.delete('/avatar/remove');
    return res.data;
  } catch (err) {
    console.error("Error removing avatar:", err);
    throw err;
  }
};

export default api;
