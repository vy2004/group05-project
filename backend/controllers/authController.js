const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
feature/refresh-token
const crypto = require('crypto');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

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

const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'group05-super-secret-jwt-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
main

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
 feature/refresh-token
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    
    // Lưu Refresh Token vào database
    const ipAddress = getIpAddress(req);
    await saveRefreshToken(user._id, refreshToken, ipAddress);

    console.log('🔐 User đăng nhập:', user.email);

    res.json({ 
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,

    if (!email || !password) return res.status(400).json({ message: 'Email và password là bắt buộc' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });

    const payload = { userId: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ 
      message: 'Đăng nhập thành công', 
      token, 
 main
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
 feature/refresh-token
        age: user.age,
        avatar: user.avatar
        age: user.age
main
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

 feature/refresh-token
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

module.exports = { signup, login, logout, refresh };

// POST /auth/logout — for stateless JWT, client should remove token; endpoint provided for symmetry
const logout = async (req, res) => {
  // If you implement token blacklisting, handle it here.
  res.json({ message: 'Logout successful on client — remove token locally' });
};

module.exports = { signup, login, logout };
main
