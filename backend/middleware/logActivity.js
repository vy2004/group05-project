// backend/middleware/logActivity.js
// SV1: Middleware để ghi lại hoạt động của người dùng

const ActivityLog = require('../models/activityLog');

/**
 * SV1: Middleware logActivity - Ghi lại hoạt động của user
 * @param {string} action - Hành động: 'login', 'logout', 'signup', etc.
 * @param {object} options - Tùy chọn: skipSuccess, includeMetadata
 */
const logActivity = (action, options = {}) => {
  return async (req, res, next) => {
    // Ghi log sau khi response được gửi
    const originalSend = res.send;
    
    res.send = function(data) {
      // Gọi hàm gốc trước
      originalSend.call(this, data);
      
      // Không log nếu skipSuccess và response thành công
      if (options.skipSuccess && res.statusCode < 400) {
        return;
      }

      // Lấy thông tin user từ request (có thể từ req.user hoặc req.body)
      const userId = req.user?.userId || req.user?._id || req.body?.userId || null;
      const userEmail = req.user?.email || req.body?.email || null;
      const userName = req.user?.name || req.body?.name || null;

      // Lấy IP address
      const ipAddress = 
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        '0.0.0.0';

      // Lấy User Agent
      const userAgent = req.headers['user-agent'] || 'Unknown';

      // Xác định success/failure dựa trên status code
      const success = res.statusCode >= 200 && res.statusCode < 400;
      const statusCode = res.statusCode;

      // Parse error message nếu có
      let errorMessage = null;
      if (!success && data) {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          errorMessage = parsed.message || parsed.error || null;
        } catch (e) {
          errorMessage = null;
        }
      }

      // Tạo metadata nếu có options.includeMetadata
      let metadata = null;
      if (options.includeMetadata) {
        metadata = {
          endpoint: req.path,
          method: req.method,
          query: Object.keys(req.query).length > 0 ? req.query : undefined,
          body: options.includeBody ? req.body : undefined
        };
      }

      // Ghi log vào database (không block response)
      ActivityLog.create({
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        action: action,
        ipAddress: ipAddress,
        userAgent: userAgent,
        endpoint: req.path,
        method: req.method,
        statusCode: statusCode,
        success: success,
        errorMessage: errorMessage,
        metadata: metadata
      }).catch(err => {
        // Log error nhưng không làm crash app
        console.error('❌ Lỗi khi ghi activity log:', err.message);
      });
    };

    next();
  };
};

/**
 * SV1: Helper function để log activity trực tiếp (không dùng middleware)
 * @param {object} logData - Dữ liệu log
 */
const logActivityDirect = async (logData) => {
  try {
    await ActivityLog.create({
      userId: logData.userId || null,
      userEmail: logData.userEmail || null,
      userName: logData.userName || null,
      action: logData.action || 'other',
      ipAddress: logData.ipAddress || '0.0.0.0',
      userAgent: logData.userAgent || 'Unknown',
      endpoint: logData.endpoint || null,
      method: logData.method || null,
      statusCode: logData.statusCode || 200,
      success: logData.success !== undefined ? logData.success : true,
      errorMessage: logData.errorMessage || null,
      metadata: logData.metadata || null
    });
  } catch (error) {
    console.error('❌ Lỗi khi ghi activity log trực tiếp:', error.message);
  }
};

module.exports = {
  logActivity,
  logActivityDirect
};
