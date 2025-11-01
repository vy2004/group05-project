const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendResetPasswordEmail } = require('../config/email'); // SV3: Sử dụng email config

// Gửi email reset password (sử dụng email config từ SV3)
const guiEmailResetPassword = async (email, resetToken) => {
  try {
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    console.log('🔐 RESET PASSWORD TOKEN:');
    console.log('Email:', email);
    console.log('Token:', resetToken.substring(0, 10) + '...');
    console.log('Reset URL:', resetURL);
    console.log('==========================================');
    
    // SV3: Gửi email sử dụng email config chuyên biệt
    const emailSent = await sendResetPasswordEmail(email, resetToken, resetURL);
    
    return emailSent;
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    return false;
  }
};

// Quên mật khẩu - gửi token reset
const quenMatKhau = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với email này'
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Gửi email
    const emailSent = await guiEmailResetPassword(email, resetToken);
    
    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi email. Vui lòng thử lại sau.'
      });
    }

  } catch (error) {
    console.error('Lỗi quen mat khau:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Reset mật khẩu với token
const resetMatKhau = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    // Tìm user với token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });

  } catch (error) {
    console.error('Lỗi reset mat khau:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  quenMatKhau,
  resetMatKhau
};
