// server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const User = require("./models/user");

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
  .then(async () => {
    console.log("✅ Kết nối MongoDB thành công");
    // Tạo admin mẫu nếu chưa có
    await taoAdminMau();
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Hàm tạo admin mẫu
const taoAdminMau = async () => {
  try {
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log("👑 Đã có admin trong hệ thống:", existingAdmin.email);
      return;
    }

    // Tạo admin mới
    const adminData = {
      name: 'Admin Quản Trị',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      age: 25
    };

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Lưu vào database
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Đã tạo tài khoản Admin thành công:");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", 'admin123');
    console.log("👑 Role:", adminData.role);

  } catch (error) {
    console.error("❌ Lỗi khi tạo admin:", error);
  }
};

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
