const mongoose = require('mongoose');
const User = require('./models/user');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB');
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

// Test upload avatar
const testAvatarUpload = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Kiểm tra user admin...');
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('❌ Không tìm thấy user admin');
      return;
    }
    
    console.log('👤 User admin:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      avatar: adminUser.avatar || 'Chưa có avatar'
    });
    
    // Test cập nhật avatar
    const testAvatarUrl = 'http://localhost:3000/uploads/test-avatar.jpg';
    console.log('🔄 Cập nhật avatar...');
    
    const updatedUser = await User.findByIdAndUpdate(
      adminUser._id,
      { avatar: testAvatarUrl },
      { new: true }
    );
    
    console.log('✅ Cập nhật avatar thành công:', {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar
    });
    
    // Test lấy user với avatar
    console.log('🔍 Lấy lại user để kiểm tra...');
    const userWithAvatar = await User.findById(adminUser._id);
    console.log('👤 User với avatar:', {
      id: userWithAvatar._id,
      name: userWithAvatar.name,
      email: userWithAvatar.email,
      avatar: userWithAvatar.avatar
    });
    
  } catch (error) {
    console.error('❌ Lỗi test avatar:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
};

testAvatarUpload();


<<<<<<< HEAD









=======
>>>>>>> origin/main
