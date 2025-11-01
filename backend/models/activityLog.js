// backend/models/activityLog.js
// SV3: Model để lưu activity logs của users

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Index để query nhanh theo userId
    },
    userEmail: {
      type: String,
      index: true // Index để query theo email
    },
    userName: {
      type: String
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'signup',
        'reset_password',
        'forgot_password',
        'update_profile',
        'upload_avatar',
        'delete_avatar',
        'update_user',
        'delete_user',
        'create_user',
        'change_role',
        'view_users',
        'view_logs',
        'other'
      ],
      index: true
    },
    ipAddress: {
      type: String,
      index: true
    },
    userAgent: {
      type: String
    },
    endpoint: {
      type: String // API endpoint được gọi
    },
    method: {
      type: String, // HTTP method: GET, POST, PUT, DELETE
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    statusCode: {
      type: Number, // HTTP status code: 200, 401, 403, 500
      default: 200
    },
    success: {
      type: Boolean,
      default: true
    },
    errorMessage: {
      type: String // Nếu có lỗi, lưu message
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed // Lưu thông tin bổ sung
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
);

// Index compound để query hiệu quả
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 }); // Index cho query theo thời gian

// Virtual để format timestamp
activityLogSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
});

// Method để lấy log summary
activityLogSchema.statics.getLogSummary = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
