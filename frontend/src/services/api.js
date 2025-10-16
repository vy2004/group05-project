import axios from "axios";

const api = axios.create({
  baseURL: "http://172.23.0.91:3000", // ✅ IP của máy backend
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
