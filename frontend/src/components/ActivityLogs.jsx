// frontend/src/components/ActivityLogs.jsx
// SV2: Component để hiển thị activity logs cho Admin

import React, { useState, useEffect } from 'react';
import { getActivityLogs, getLogStats, deleteLog } from '../services/api';
import './ActivityLogs.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [filterAction, setFilterAction] = useState('');
  const [filterSuccess, setFilterSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Action options
  const actionOptions = [
    '', 'login', 'logout', 'signup', 'reset_password', 'forgot_password',
    'update_profile', 'upload_avatar', 'delete_avatar', 'update_user',
    'delete_user', 'create_user', 'change_role', 'view_users', 'view_logs', 'other'
  ];

  useEffect(() => {
    loadLogs();
    loadStats();
  }, [page, limit, filterAction, filterSuccess, searchTerm]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit,
        ...(filterAction && { action: filterAction }),
        ...(filterSuccess !== '' && { success: filterSuccess }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await getActivityLogs(params);
      
      if (response.success) {
        setLogs(response.data.logs);
      } else {
        setError(response.message || 'Không thể tải logs');
      }
    } catch (err) {
      console.error('Lỗi khi tải logs:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải logs');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getLogStats(7);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải stats:', err);
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Bạn có chắc muốn xóa log này?')) {
      return;
    }

    try {
      const response = await deleteLog(logId);
      if (response.success) {
        // Reload logs
        loadLogs();
        loadStats();
      } else {
        alert(response.message || 'Không thể xóa log');
      }
    } catch (err) {
      console.error('Lỗi khi xóa log:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa log');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionBadgeClass = (action) => {
    const classes = {
      login: 'badge-success',
      logout: 'badge-info',
      signup: 'badge-primary',
      reset_password: 'badge-warning',
      forgot_password: 'badge-warning',
      upload_avatar: 'badge-success',
      delete_avatar: 'badge-danger',
      update_user: 'badge-primary',
      delete_user: 'badge-danger',
      create_user: 'badge-success',
      change_role: 'badge-warning',
      view_logs: 'badge-info'
    };
    return classes[action] || 'badge-secondary';
  };

  const handleResetFilters = () => {
    setFilterAction('');
    setFilterSuccess('');
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="activity-logs-container">
      <div className="activity-logs-header">
        <h2>📊 Activity Logs</h2>
        <p className="subtitle">Quản lý và theo dõi hoạt động của người dùng</p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-label">Tổng Logs</div>
            <div className="stat-value">{stats.totalLogs || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Thành công</div>
            <div className="stat-value success">{stats.logsByAction?.reduce((sum, item) => sum + (item.successCount || 0), 0) || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Thất bại</div>
            <div className="stat-value danger">{stats.logsByAction?.reduce((sum, item) => sum + (item.failureCount || 0), 0) || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Top Action</div>
            <div className="stat-value">
              {stats.logsByAction?.[0]?._id || 'N/A'} ({stats.logsByAction?.[0]?.count || 0})
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Action:</label>
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
          >
            {actionOptions.map(action => (
              <option key={action} value={action}>
                {action || 'Tất cả'}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterSuccess}
            onChange={(e) => {
              setFilterSuccess(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả</option>
            <option value="true">Thành công</option>
            <option value="false">Thất bại</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Email hoặc tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button onClick={handleResetFilters} className="btn-reset">
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="logs-table-container">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : logs.length === 0 ? (
          <div className="no-logs">Không có logs nào</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className={log.success ? '' : 'row-error'}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">{log.userName || log.userEmail || 'N/A'}</div>
                      {log.userEmail && (
                        <div className="user-email">{log.userEmail}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.ipAddress || 'N/A'}</td>
                  <td className="endpoint-cell">{log.endpoint || 'N/A'}</td>
                  <td>
                    {log.success ? (
                      <span className="status success">✓ {log.statusCode}</span>
                    ) : (
                      <span className="status error">✗ {log.statusCode}</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      className="btn-delete"
                      title="Xóa log"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1 || loading}
        >
          ← Prev
        </button>
        <span>Trang {page}</span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={logs.length < limit || loading}
        >
          Next →
        </button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
            setPage(1);
          }}
        >
          <option value="25">25 / trang</option>
          <option value="50">50 / trang</option>
          <option value="100">100 / trang</option>
        </select>
      </div>
    </div>
  );
};

export default ActivityLogs;
