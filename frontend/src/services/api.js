// 📁 src/services/api.js
import axios from "axios";

// ✅ Cấu hình địa chỉ backend (IP của máy backend)
const api = axios.create({
  baseURL: "http://192.168.1.10:3000", // ⚠️ Thay bằng IP thật backend nếu khác
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ✅ Kiểm tra thử khi khởi tạo (log ra console)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Lỗi API:", error.message);
    return Promise.reject(error);
  }
);

export default api;
