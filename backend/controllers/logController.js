// backend/controllers/logController.js
// SV3: Controller để quản lý activity logs

const ActivityLog = require('../models/activityLog');
const User = require('../models/user');

/**
 * GET /logs - Lấy danh sách logs (chỉ Admin)
 * Query params:
 * - page: số trang (default: 1)
 * - limit: số logs mỗi trang (default: 50, max: 100)
 * - userId: filter theo userId
 * - action: filter theo action
 * - startDate: filter từ ngày (ISO format)
 * - endDate: filter đến ngày (ISO format)
 * - ipAddress: filter theo IP
 */
const getLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      startDate,
      endDate,
      ipAddress,
      success,
      search // Tìm kiếm theo email hoặc name
    } = req.query;

    // Validate limit (max 100)
    const limitNum = Math.min(parseInt(limit), 100);
    const pageNum = Math.max(parseInt(page), 1);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    if (userId) {
      query.userId = userId;
    }

    if (action) {
      query.action = action;
    }

    if (ipAddress) {
      query.ipAddress = ipAddress;
    }

    if (success !== undefined) {
      query.success = success === 'true' || success === true;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search by email or name
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }

    // Get logs với populate user info
    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 }) // Mới nhất trước
      .skip(skip)
      .limit(limitNum)
      .lean(); // Dùng lean() để performance tốt hơn

    // Get total count
    const total = await ActivityLog.countDocuments(query);

    // Get statistics
    const stats = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      successCount: await ActivityLog.countDocuments({ ...query, success: true }),
      failureCount: await ActivityLog.countDocuments({ ...query, success: false })
    };

    // Group by action
    const actionStats = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs,
        stats,
        actionStats
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy logs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy logs. Vui lòng thử lại sau.'
    });
  }
};

/**
 * GET /logs/stats - Lấy thống kê logs
 */
const getLogStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total logs
    const totalLogs = await ActivityLog.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Logs by action
    const logsByAction = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          failureCount: {
            $sum: { $cond: ['$success', 0, 1] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Logs by date (daily)
    const logsByDate = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'Asia/Ho_Chi_Minh'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top users by activity
    const topUsers = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          userId: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          userEmail: { $first: '$userEmail' },
          userName: { $first: '$userName' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top IPs
    const topIPs = await ActivityLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$ipAddress',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        logsByAction,
        logsByDate,
        topUsers,
        topIPs,
        period: `${days} ngày`
      }
    });

  } catch (error) {
    console.error('Lỗi khi lấy stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê. Vui lòng thử lại sau.'
    });
  }
};

/**
 * GET /logs/:id - Lấy chi tiết một log
 */
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await ActivityLog.findById(id)
      .populate('userId', 'name email role avatar');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy log'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {
    console.error('Lỗi khi lấy log:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy log. Vui lòng thử lại sau.'
    });
  }
};

/**
 * DELETE /logs/:id - Xóa một log (chỉ Admin)
 */
const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await ActivityLog.findByIdAndDelete(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy log'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa log thành công'
    });

  } catch (error) {
    console.error('Lỗi khi xóa log:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa log. Vui lòng thử lại sau.'
    });
  }
};

/**
 * DELETE /logs - Xóa nhiều logs (chỉ Admin)
 * Body: { ids: [id1, id2, ...] } hoặc { olderThanDays: 30 }
 */
const deleteLogs = async (req, res) => {
  try {
    const { ids, olderThanDays } = req.body;

    let deletedCount = 0;

    if (ids && Array.isArray(ids)) {
      // Xóa theo danh sách IDs
      const result = await ActivityLog.deleteMany({ _id: { $in: ids } });
      deletedCount = result.deletedCount;
    } else if (olderThanDays) {
      // Xóa logs cũ hơn X ngày
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(olderThanDays));
      const result = await ActivityLog.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      deletedCount = result.deletedCount;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cần cung cấp ids hoặc olderThanDays'
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa ${deletedCount} logs thành công`,
      deletedCount
    });

  } catch (error) {
    console.error('Lỗi khi xóa logs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa logs. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  getLogs,
  getLogStats,
  getLogById,
  deleteLog,
  deleteLogs
};
