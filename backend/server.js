// 📁 backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Cấu hình CORS — chỉ cho phép truy cập từ frontend React
app.use(
  cors({
    origin: [
      "http://localhost:3001",     // frontend chạy trên cùng máy
      "http://192.168.1.7:3001",   // nếu frontend chạy trên máy khác cùng LAN
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Cho phép đọc JSON từ body request
app.use(express.json());

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ MongoDB lỗi:", err.message));

// ✅ Import và dùng router User
const userRouter = require("./routes/user");
app.use("/users", userRouter); // <-- Đường dẫn đúng cho frontend gọi /users

// ✅ Route test (để kiểm tra nhanh backend có hoạt động)
app.get("/", (req, res) => {
  res.send("🚀 Backend đang hoạt động!");
});

// ✅ Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend chạy tại: http://192.168.1.7:${PORT}`);
});