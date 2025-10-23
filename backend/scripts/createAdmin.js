const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/group05-project');
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

// Tạo tài khoản Admin mẫu
const taoAdminMau = async () => {
  try {
    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('👑 Đã có admin trong hệ thống:', existingAdmin.email);
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

    console.log('✅ Đã tạo tài khoản Admin thành công:');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', 'admin123');
    console.log('👑 Role:', adminData.role);
    console.log('🆔 ID:', admin._id);

  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
  }
};

// Chạy script
const chayScript = async () => {
  await connectDB();
  await taoAdminMau();
  await mongoose.connection.close();
  console.log('🔚 Đã đóng kết nối database');
};

chayScript();
