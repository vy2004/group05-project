const express = require('express');
const router = express.Router();
const { signup, login, logout, refresh, forgotPassword, resetPassword } = require('../controllers/authController');
const { logActivity } = require('../middleware/logActivity'); // SV1: Activity logging
const { 
  loginRateLimiter, 
  forgotPasswordRateLimiter, 
  signupRateLimiter 
} = require('../middleware/rateLimiter'); // SV1: Rate limiting

// SV1: Apply rate limiting và logging
router.post('/signup', signupRateLimiter, logActivity('signup'), signup);
router.post('/login', loginRateLimiter, logActivity('login'), login);
router.post('/logout', logActivity('logout'), logout);
router.post('/refresh', refresh); // ✅ Endpoint refresh token mới

// SV1: Forgot Password & Reset Password APIs với rate limiting
router.post('/forgot-password', forgotPasswordRateLimiter, logActivity('forgot_password'), forgotPassword);
router.post('/resetpassword/:token', logActivity('reset_password'), resetPassword);

module.exports = router;
