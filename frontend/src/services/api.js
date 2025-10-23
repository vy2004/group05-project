// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// (tuỳ chọn) Interceptor hiện alert khi lỗi:
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err?.message);
    return Promise.reject(err);
  }
);

export default api;
