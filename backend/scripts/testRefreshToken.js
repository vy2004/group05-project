require('dotenv').config();
const mongoose = require('mongoose');
const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');

const MONGODB_URI = "mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB";

async function testRefreshToken() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    // Lấy user đầu tiên để test
    const user = await User.findOne();
    if (!user) {
      console.log('❌ Không có user để test');
      return;
    }

    console.log('🧪 Test với user:', user.email);

    // 1. Tạo Refresh Token mới
    const token = 'test_refresh_token_' + Date.now();
    const refreshToken = await RefreshToken.create({
      token: token,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      createdByIp: '127.0.0.1'
    });
    console.log('✅ Tạo Refresh Token:', refreshToken._id);

    // 2. Tìm Refresh Token
    const found = await RefreshToken.findOne({ token: token });
    console.log('✅ Tìm thấy token:', found ? 'Yes' : 'No');
    console.log('   - isActive:', found.isActive);
    console.log('   - isExpired:', found.isExpired);

    // 3. Revoke token
    await found.revoke('127.0.0.1');
    console.log('✅ Đã revoke token');

    const revoked = await RefreshToken.findById(found._id);
    console.log('   - isActive sau khi revoke:', revoked.isActive);

    // 4. Cleanup
    await RefreshToken.deleteMany({ userId: user._id });
    console.log('✅ Đã xóa test data');

    console.log('\n🎉 Test hoàn tất thành công!');

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Đã ngắt kết nối MongoDB');
  }
}

testRefreshToken();

