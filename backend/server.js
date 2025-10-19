// server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

dotenv.config();
const app = express();

// ✅ Cho phép frontend React (port 3001) gọi API
app.use(
  cors({
    origin: "http://localhost:3001", // frontend chạy ở port 3001
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ✅ Đọc dữ liệu JSON từ request body
app.use(express.json());

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB"
  )
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ Dùng routes/user.js cho CRUD
app.use("/users", userRoutes);
// ✅ Dùng routes/auth.js cho authentication
app.use("/auth", authRoutes);
// ✅ Dùng routes/profile.js cho quản lý profile
app.use("/profile", profileRoutes);

// ✅ Khởi động backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});
