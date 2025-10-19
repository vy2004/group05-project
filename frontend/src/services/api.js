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
    if (err.response?.status === 401) {
      // Nếu token hết hạn hoặc không hợp lệ
      localStorage.removeItem('jwt_token');
      api.setAuthToken(null);
      window.location.reload();
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

export const getProfile = async () => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    throw err;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await api.put('/profile', profileData);
    return res.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
};

export default api;
