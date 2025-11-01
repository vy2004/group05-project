// backend/test-forgot-password-email.js
// SV3: Test script để kiểm tra gửi email reset password với token

const { sendResetPasswordEmail, verifyEmailConfig } = require('./config/email');
const crypto = require('crypto');
require('dotenv').config();

async function testForgotPasswordEmail() {
  console.log('🧪 Testing Forgot Password Email Functionality');
  console.log('==========================================\n');

  // 1. Kiểm tra cấu hình email
  console.log('📋 Bước 1: Kiểm tra cấu hình email...');
  const verifyResult = await verifyEmailConfig();
  
  if (!verifyResult.success) {
    console.error('❌ Email chưa được cấu hình đúng:');
    console.error('   ', verifyResult.message);
    console.log('\n📝 Hướng dẫn cấu hình:');
    console.log('   1. Tạo file .env trong thư mục backend');
    console.log('   2. Thêm các dòng sau:');
    console.log('      EMAIL_USER=your-email@gmail.com');
    console.log('      EMAIL_PASS=your-app-password');
    console.log('   3. Xem file CAU_HINH_EMAIL.md để biết cách tạo App Password');
    return;
  }

  // 2. Tạo token test
  console.log('\n📋 Bước 2: Tạo reset token test...');
  const testToken = crypto.randomBytes(32).toString('hex');
  console.log('✅ Token test:', testToken.substring(0, 20) + '...');

  // 3. Tạo reset URL
  console.log('\n📋 Bước 3: Tạo reset URL...');
  const resetURL = `http://localhost:3001/reset-password?token=${testToken}`;
  console.log('✅ Reset URL:', resetURL);

  // 4. Gửi email test
  console.log('\n📋 Bước 4: Gửi email test...');
  const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER || 'test@example.com';
  console.log('📧 Email test sẽ gửi đến:', testEmail);
  
  const emailSent = await sendResetPasswordEmail(testEmail, testToken, resetURL);

  if (emailSent) {
    console.log('\n✅ TEST THÀNH CÔNG!');
    console.log('📧 Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    console.log('\n📝 Thông tin để test:');
    console.log('   - Token:', testToken);
    console.log('   - Reset URL:', resetURL);
    console.log('   - Email nhận:', testEmail);
  } else {
    console.log('\n❌ TEST THẤT BẠI!');
    console.log('   Không thể gửi email. Vui lòng kiểm tra lại cấu hình.');
  }

  console.log('\n==========================================');
}

// Chạy test
testForgotPasswordEmail().catch(error => {
  console.error('❌ Lỗi khi chạy test:', error);
  process.exit(1);
});
