const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'group05-super-secret-jwt-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        age: user.age
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/logout — for stateless JWT, client should remove token; endpoint provided for symmetry
const logout = async (req, res) => {
  // If you implement token blacklisting, handle it here.
  res.json({ message: 'Logout successful on client — remove token locally' });
};

module.exports = { signup, login, logout };
