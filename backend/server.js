const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // đọc file .env

const app = express();

// ✅ Bật CORS cho phép các máy khác (frontend) gọi API
app.use(
  cors({
    origin: "*", // cho phép tất cả domain (mọi máy trong LAN)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Cho phép đọc JSON từ body request
app.use(express.json());

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Import route users
const userRouter = require("./routes/user");
app.use("/users", userRouter);

// ✅ Khởi động server (cho phép các máy cùng mạng LAN truy cập)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend chạy tại: http://192.168.1.10:${PORT}`);
});