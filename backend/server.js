// 📦 Import các module cần thiết
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Đọc file .env

const app = express();

// 🟢 Cấu hình CORS - cho phép frontend truy cập API từ mọi máy
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// 🟢 Cho phép đọc JSON từ body request
app.use(express.json());

// 🟢 Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // ⏱ tránh treo nếu Atlas chậm
  })
  .then(() => {
    console.log("✅ Kết nối MongoDB Atlas thành công!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB Atlas:", err.message);
  });

// 🟢 Import và dùng route cho User
const userRouter = require("./routes/user");
app.use("/users", userRouter);

// 🟢 Khởi động server (cho phép các máy trong cùng mạng LAN truy cập)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("==============================================");
  console.log(`🚀 Backend đang chạy tại: http://localhost:${PORT}`);
  console.log("🌍 Cho phép truy cập từ mọi thiết bị trong mạng LAN");
  console.log("==============================================");
});