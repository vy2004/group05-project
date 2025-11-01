const express = require('express');
const router = express.Router();
const { signup, login, logout, refresh, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh); // ✅ Endpoint refresh token mới

// SV1: Forgot Password & Reset Password APIs
router.post('/forgot-password', forgotPassword); // POST /auth/forgot-password
router.post('/resetpassword/:token', resetPassword); // POST /auth/resetpassword/:token

module.exports = router;
