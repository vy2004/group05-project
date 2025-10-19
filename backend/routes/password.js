const express = require('express');
const router = express.Router();
const { quenMatKhau, resetMatKhau } = require('../controllers/passwordController');

// POST /password/forgot - Quên mật khẩu
router.post('/forgot', quenMatKhau);

// POST /password/reset - Reset mật khẩu với token
router.post('/reset', resetMatKhau);

module.exports = router;

