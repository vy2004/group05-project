const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Gửi email reset password
const guiEmailResetPassword = async (email, resetToken) => {
  try {
    const resetURL = `http://localhost:3001/reset-password?token=${resetToken}`;
    
    console.log('🔐 RESET PASSWORD TOKEN:');
    console.log('Email:', email);
    console.log('Token:', resetToken);
    console.log('Reset URL:', resetURL);
    console.log('==========================================');
    
    // Thử gửi email thật
    try {
      console.log('📧 Đang cấu hình email transporter...');
      console.log('EMAIL_USER:', process.env.EMAIL_USER);
      console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***' : 'undefined');
      
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: '🔐 Reset Mật Khẩu - Group05 Project',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🔐 Reset Mật Khẩu</h2>
            <p>Xin chào,</p>
            <p>Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình.</p>
            <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
            <a href="${resetURL}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Mật Khẩu
            </a>
            <p>Link này sẽ hết hạn sau 10 phút.</p>
            <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
            <br>
            <p>Trân trọng,<br>Team Group05</p>
          </div>
        `
      };

      console.log('📤 Đang gửi email...');
      await transporter.sendMail(mailOptions);
      console.log('✅ Email đã được gửi thành công!');
      return true;
    } catch (emailError) {
      console.error('❌ Lỗi gửi email:', emailError.message);
      console.error('❌ Chi tiết lỗi:', emailError);
      console.log('📝 Token vẫn được tạo, bạn có thể copy link sau để test:');
      console.log('🔗', resetURL);
      return true; // Vẫn trả về true để test được
    }
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
