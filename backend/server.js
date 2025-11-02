// server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user");

// Load env FIRST, trước khi require các routes/controllers dùng process.env
dotenv.config();

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const avatarRoutes = require("./routes/avatar");
const profileRoutes = require("./routes/profile");
const passwordRoutes = require("./routes/password");
const logRoutes = require("./routes/logs"); // SV3: Activity logs routes

const app = express();

// ✅ Cho phép frontend React (port 3001) gọi API
app.use(
  cors({
    origin: "http://localhost:3001", // frontend chạy ở port 3001
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// ✅ Đọc dữ liệu JSON từ request body
app.use(express.json());

// ✅ Serve static files từ folder uploads (để hiển thị avatar)
app.use('/uploads', express.static('uploads'));

// ✅ Kết nối MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB"
  )
  .then(async () => {
    console.log("✅ Kết nối MongoDB thành công");
    // Tạo các tài khoản mẫu nếu chưa có
    await taoDuLieuMau();
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Hàm tạo dữ liệu mẫu (Admin, Moderator, User)
const taoDuLieuMau = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    
    // Mảng các tài khoản mẫu cần tạo
    const seedUsers = [
      {
        name: 'Admin Quản Trị',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        age: 30
      },
      {
        name: 'Moderator Điều Hành',
        email: 'moderator@example.com',
        password: 'mod123',
        role: 'moderator',
        age: 28
      },
      {
        name: 'User Thường',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        age: 25
      }
    ];

    // Kiểm tra và tạo từng tài khoản
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        // Kiểm tra nếu user cũ thiếu password, thì xóa và tạo lại
        if (!existingUser.password) {
          console.log(`🔄 User ${userData.role} thiếu password, xóa và tạo lại...`);
          await User.deleteOne({ _id: existingUser._id });
          // Tạo lại user mới với password
          const hashedPassword = await bcrypt.hash(userData.password, salt);
          const user = new User({
            ...userData,
            password: hashedPassword
          });
          await user.save();
          console.log(`✅ Đã tạo lại ${userData.role} thành công:`);
          console.log(`   📧 Email: ${userData.email}`);
          console.log(`   🔑 Password: ${userData.password}`);
          console.log(`   ${userData.role === 'admin' ? '👑' : userData.role === 'moderator' ? '🛡️' : '👤'} Role: ${userData.role}`);
        } else {
          console.log(`👤 Đã có ${userData.role}:`, userData.email);
        }
      } else {
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Tạo user mới
        const user = new User({
          ...userData,
          password: hashedPassword
        });
        
        await user.save();
        
        console.log(`✅ Đã tạo ${userData.role} thành công:`);
        console.log(`   📧 Email: ${userData.email}`);
        console.log(`   🔑 Password: ${userData.password}`);
        console.log(`   ${userData.role === 'admin' ? '👑' : userData.role === 'moderator' ? '🛡️' : '👤'} Role: ${userData.role}`);
      }
    }
    
    console.log("\n✨ Khởi tạo dữ liệu mẫu hoàn tất!\n");

  } catch (error) {
    console.error("❌ Lỗi khi tạo dữ liệu mẫu:", error);
  }
};

// ✅ Dùng routes/user.js cho CRUD
app.use("/users", userRoutes);
// ✅ Dùng routes/auth.js cho authentication
app.use("/auth", authRoutes);
// ✅ Dùng routes/profile.js cho quản lý profile
app.use("/profile", profileRoutes);
// ✅ Dùng routes/avatar.js cho upload/xóa avatar
app.use("/avatar", avatarRoutes);
// ✅ Dùng routes/password.js cho quên/reset mật khẩu
app.use("/password", passwordRoutes);
// ✅ Dùng routes/logs.js cho activity logs (SV3)
app.use("/logs", logRoutes);

// ✅ Khởi động backend server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});
