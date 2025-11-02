const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const { sendResetPasswordEmail } = require('../config/email'); // SV3: Sử dụng email config
const { logActivityDirect } = require('../middleware/logActivity'); // SV1: Activity logging

const JWT_SECRET = process.env.JWT_SECRET || 'group05-super-secret-jwt-key-2024';
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // Access token: 15 phút
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // Refresh token: 7 ngày

// ==================== HELPER FUNCTIONS ====================

// Tạo Access Token
function generateAccessToken(user) {
  const payload = { 
    userId: user._id, 
    email: user.email, 
    role: user.role 
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

// Tạo Refresh Token
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

// Lưu Refresh Token vào database
async function saveRefreshToken(userId, token, ipAddress) {
  const refreshToken = await RefreshToken.create({
    token: token,
    userId: userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
    createdByIp: ipAddress
  });
  return refreshToken;
}

// Lấy IP address từ request
function getIpAddress(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.ip ||
         '0.0.0.0';
}

// ==================== API ENDPOINTS ====================

// POST /auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email và password là bắt buộc' });
    }

    // Kiểm tra email trùng
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'Email đã được sử dụng' });

    // Hash mật khẩu
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email: email.toLowerCase().trim(), password: hashed, age });
    await user.save();

    // Trả về thông tin cơ bản (không trả password)
    const { password: _p, ...userSafe } = user.toObject();
    res.status(201).json({ message: 'Đăng ký thành công', user: userSafe });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) return res.status(409).json({ message: 'Email đã tồn tại' });
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    const ipAddress = getIpAddress(req);
    
    if (!user) {
      // SV1: Log failed login attempt
      await logActivityDirect({
        userEmail: email,
        action: 'login',
        ipAddress: ipAddress,
        userAgent: req.headers['user-agent'],
        endpoint: req.path,
        method: req.method,
        statusCode: 401,
        success: false,
        errorMessage: 'Email hoặc mật khẩu không chính xác'
      });
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // SV1: Log failed login attempt
      await logActivityDirect({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        action: 'login',
        ipAddress: ipAddress,
        userAgent: req.headers['user-agent'],
        endpoint: req.path,
        method: req.method,
        statusCode: 401,
        success: false,
        errorMessage: 'Email hoặc mật khẩu không chính xác'
      });
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    
    // Lưu Refresh Token vào database (ipAddress đã được lấy ở trên)
    await saveRefreshToken(user._id, refreshToken, ipAddress);

    // SV1: Log activity login thành công
    await logActivityDirect({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      action: 'login',
      ipAddress: ipAddress,
      userAgent: req.headers['user-agent'],
      endpoint: req.path,
      method: req.method,
      statusCode: 200,
      success: true
    });

    console.log('🔐 User đăng nhập:', user.email);

    res.json({ 
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        age: user.age,
        avatar: user.avatar
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token là bắt buộc' });
    }

    // Tìm refresh token trong database
    const storedToken = await RefreshToken.findOne({ token: refreshToken })
      .populate('userId');

    if (!storedToken) {
      return res.status(404).json({ message: 'Refresh token không tồn tại' });
    }

    // Kiểm tra token còn active không
    if (!storedToken.isActive) {
      return res.status(401).json({ 
        message: 'Refresh token đã hết hạn hoặc bị thu hồi' 
      });
    }

    const user = storedToken.userId;

    // Tạo Access Token mới
    const newAccessToken = generateAccessToken(user);
    
    // Tạo Refresh Token mới (rotation)
    const newRefreshToken = generateRefreshToken();
    const ipAddress = getIpAddress(req);
    
    // Revoke token cũ và tạo token mới
    await storedToken.revoke(ipAddress, newRefreshToken);
    await saveRefreshToken(user._id, newRefreshToken, ipAddress);

    console.log('🔄 Refresh token thành công cho user:', user.email);

    res.json({
      message: 'Refresh token thành công',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.json({ message: 'Logout thành công' });
    }

    // Revoke refresh token
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (storedToken && storedToken.isActive) {
      const ipAddress = getIpAddress(req);
      await storedToken.revoke(ipAddress);
      console.log('🚪 Đã revoke refresh token cho user:', storedToken.userId);
    }

    res.json({ message: 'Logout thành công' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ==================== SV1: FORGOT PASSWORD & RESET PASSWORD ====================

// POST /auth/forgot-password - SV1: API quên mật khẩu, sinh token + gửi email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Trả về thành công (security: không cho biết email có tồn tại hay không)
      return res.status(200).json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email reset mật khẩu.'
      });
    }

    // SV1: Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // SV3: Gửi email với token (sử dụng email config từ SV3)
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    const emailSent = await sendResetPasswordEmail(user.email, resetToken, resetURL);
    
    if (emailSent) {
      console.log('✅ Email reset password đã được gửi đến:', user.email);
      res.status(200).json({
        success: true,
        message: 'Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
      });
    } else {
      // Token vẫn được tạo, nhưng email không gửi được
      console.warn('⚠️  Token đã được tạo nhưng email không gửi được:', user.email);
      res.status(200).json({
        success: true,
        message: 'Yêu cầu reset mật khẩu đã được xử lý. Vui lòng kiểm tra email hoặc liên hệ admin.',
        // Chỉ trả về token trong development (không nên làm vậy trong production)
        ...(process.env.NODE_ENV !== 'production' && { token: resetToken })
      });
    }

  } catch (error) {
    console.error('Lỗi forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// POST /auth/resetpassword/:token - SV1: API reset password với token từ URL
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Lấy token từ URL params
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token là bắt buộc'
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới là bắt buộc'
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
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

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Reset password thành công cho user:', user.email);

    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });

  } catch (error) {
    console.error('Lỗi reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

module.exports = { signup, login, logout, refresh, forgotPassword, resetPassword };
