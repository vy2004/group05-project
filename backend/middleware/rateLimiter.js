// backend/middleware/rateLimiter.js
// SV1: Rate limiting middleware để chống brute force attack

const rateLimit = require('express-rate-limit');

/**
 * SV1: Rate limiter cho login endpoint - chống brute force
 * Cho phép 5 lần thử trong 15 phút cho MỖI TÀI KHOẢN (email)
 * Mỗi email có giới hạn riêng, không ảnh hưởng đến email khác
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // 5 requests trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.'
  },
  standardHeaders: true, // Trả về rate limit info trong `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Custom key generator - dùng EMAIL thay vì IP để mỗi tài khoản có giới hạn riêng
  keyGenerator: (req) => {
    // Ưu tiên dùng email từ body, nếu không có thì dùng IP (fallback)
    const email = req.body?.email;
    if (email) {
      // Chuẩn hóa email (lowercase, trim) để tránh trùng key do format khác nhau
      return `login:${email.toLowerCase().trim()}`;
    }
    // Fallback về IP nếu không có email (nhưng trường hợp này không nên xảy ra)
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           '0.0.0.0';
  },
  // Custom handler khi vượt quá limit
  handler: (req, res) => {
    const email = req.body?.email || 'unknown';
    console.warn('⚠️  Rate limit exceeded for login - Email:', email);
    res.status(429).json({
      success: false,
      message: 'Quá nhiều lần thử đăng nhập cho tài khoản này. Vui lòng thử lại sau 15 phút.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000) // Số giây còn lại
    });
  },
  // Chỉ đếm các request thất bại (skip successful requests)
  // Nếu đăng nhập thành công, không tính vào limit
  skipSuccessfulRequests: true,
  // Không skip failed requests - đếm cả failed requests
  skipFailedRequests: false
});

/**
 * SV1: Rate limiter cho forgot password endpoint
 * Cho phép 3 lần gửi email reset trong 1 giờ từ cùng một IP
 */
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // 3 requests trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu reset mật khẩu. Vui lòng thử lại sau 1 giờ.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Dùng email nếu có, nếu không dùng IP
    const email = req.body?.email;
    return email ? `forgot-password:${email.toLowerCase()}` : req.ip;
  },
  handler: (req, res) => {
    console.warn('⚠️  Rate limit exceeded for forgot password:', req.ip);
    res.status(429).json({
      success: false,
      message: 'Quá nhiều yêu cầu reset mật khẩu. Vui lòng thử lại sau 1 giờ.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * SV1: Rate limiter chung cho API endpoints
 * Cho phép 100 requests trong 15 phút từ cùng một IP
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 requests trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều requests. Vui lòng thử lại sau.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Ưu tiên dùng userId nếu đã authenticate, nếu không dùng IP
    return req.user?.userId ? `user:${req.user.userId}` : req.ip;
  }
});

/**
 * SV1: Rate limiter cho signup endpoint
 * Cho phép 3 lần đăng ký trong 1 giờ từ cùng một IP
 */
const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // 3 requests trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           '0.0.0.0';
  }
});

module.exports = {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  apiRateLimiter,
  signupRateLimiter
};
