// backend/config/email.js
// SV3: Cấu hình Nodemailer + Gmail SMTP chuyên biệt

const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Tạo email transporter với Gmail SMTP
 * Sử dụng App Password từ Gmail (không dùng mật khẩu thường)
 */
const createEmailTransporter = () => {
  // Kiểm tra cấu hình email
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_ADDRESS;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPass) {
    console.warn('⚠️  EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env');
    console.warn('   Email sẽ không được gửi. Vui lòng kiểm tra file .env');
    return null;
  }

  // Tạo transporter với Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true cho port 465, false cho port 587
    auth: {
      user: emailUser,
      pass: emailPass.replace(/\s/g, '') // Xóa khoảng trắng trong App Password
    },
    tls: {
      // Không reject unauthorized certificates
      rejectUnauthorized: false
    }
  });

  return transporter;
};

/**
 * Kiểm tra kết nối email transporter
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      return { success: false, message: 'Email transporter chưa được cấu hình' };
    }

    await transporter.verify();
    console.log('✅ Email transporter đã sẵn sàng');
    return { success: true, message: 'Email transporter đã sẵn sàng' };
  } catch (error) {
    console.error('❌ Lỗi xác minh email transporter:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Gửi email reset password với token
 * @param {string} toEmail - Email người nhận
 * @param {string} resetToken - Token reset password
 * @param {string} resetURL - URL đầy đủ để reset password
 */
const sendResetPasswordEmail = async (toEmail, resetToken, resetURL) => {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.error('❌ Không thể tạo email transporter. Vui lòng kiểm tra cấu hình .env');
      return false;
    }

    const emailUser = process.env.EMAIL_USER || process.env.EMAIL_ADDRESS;
    
    const mailOptions = {
      from: `"Group05 Project" <${emailUser}>`,
      to: toEmail,
      subject: '🔐 Reset Mật Khẩu - Group05 Project',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">🔐 Reset Mật Khẩu</h2>
            
            <p style="color: #666; line-height: 1.6;">Xin chào,</p>
            
            <p style="color: #666; line-height: 1.6;">
              Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình. 
              Vui lòng click vào nút bên dưới để đặt lại mật khẩu:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; 
                        font-weight: bold; font-size: 16px;">
                Reset Mật Khẩu
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              <strong>Lưu ý:</strong> Link này sẽ hết hạn sau <strong>10 phút</strong>.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này. 
              Tài khoản của bạn vẫn an toàn.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 20px;">
              Trân trọng,<br>
              <strong>Team Group05</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Email này được gửi tự động, vui lòng không reply.</p>
            <p>Token: <code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${resetToken}</code></p>
          </div>
        </div>
      `,
      text: `
Reset Mật Khẩu - Group05 Project

Xin chào,

Bạn đã yêu cầu reset mật khẩu cho tài khoản của mình.

Vui lòng click vào link sau để đặt lại mật khẩu:
${resetURL}

Lưu ý: Link này sẽ hết hạn sau 10 phút.

Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Team Group05
      `
    };

    console.log('📧 Đang gửi email reset password...');
    console.log('   To:', toEmail);
    console.log('   Token:', resetToken.substring(0, 10) + '...');
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email đã được gửi thành công!');
    console.log('   Message ID:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi gửi email reset password:', error.message);
    console.error('   Chi tiết:', error);
    return false;
  }
};

module.exports = {
  createEmailTransporter,
  verifyEmailConfig,
  sendResetPasswordEmail
};
