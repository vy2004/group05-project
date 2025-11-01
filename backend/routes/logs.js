// backend/routes/logs.js
// SV3: Routes để quản lý activity logs

const express = require('express');
const router = express.Router();
const { getLogs, getLogStats, getLogById, deleteLog, deleteLogs } = require('../controllers/logController');
const { xacThuc } = require('../middleware/auth');
const { kiemTraQuyenAdmin } = require('../middleware/rbac'); // Chỉ Admin mới xem được logs
const { logActivity } = require('../middleware/logActivity'); // SV1: Log activity khi xem logs

// Tất cả routes đều yêu cầu authentication và quyền Admin
router.use(xacThuc);
router.use(kiemTraQuyenAdmin);

// GET /logs - Lấy danh sách logs
router.get('/', logActivity('view_logs'), getLogs);

// GET /logs/stats - Lấy thống kê logs
router.get('/stats', getLogStats);

// GET /logs/:id - Lấy chi tiết một log
router.get('/:id', getLogById);

// DELETE /logs/:id - Xóa một log
router.delete('/:id', logActivity('delete_log'), deleteLog);

// DELETE /logs - Xóa nhiều logs
router.delete('/', logActivity('delete_logs'), deleteLogs);

module.exports = router;
