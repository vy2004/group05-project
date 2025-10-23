import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Lấy danh sách user khi component mount
  useEffect(() => {
    taiDanhSachUser();
  }, []);

  const taiDanhSachUser = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUsers();
      setUsers(response.users || response); // Hỗ trợ cả format mới và cũ
    } catch (err) {
      console.error('Lỗi khi tải danh sách user:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách user');
    } finally {
      setLoading(false);
    }
  };

  const xoaUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa user "${userName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(userId);
      await deleteUser(userId);
      
      // Cập nhật danh sách user sau khi xóa
      setUsers(users.filter(user => user._id !== userId));
      alert('Xóa user thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa user:', err);
      alert(err.response?.data?.message || 'Không thể xóa user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const dinhDangNgay = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const layMauRole = (role) => {
    return role === 'admin' ? 'role-admin' : 'role-user';
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải danh sách user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔧 Bảng Quản Trị Admin</h1>
        <p>Quản lý danh sách người dùng trong hệ thống</p>
        <button 
          className="btn-refresh" 
          onClick={taiDanhSachUser}
          disabled={loading}
        >
          🔄 Làm mới
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={taiDanhSachUser}>Thử lại</button>
        </div>
      )}

      <div className="users-stats">
        <div className="stat-card">
          <h3>Tổng số user</h3>
          <span className="stat-number">{users.length}</span>
        </div>
        <div className="stat-card">
          <h3>Admin</h3>
          <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
        </div>
        <div className="stat-card">
          <h3>User thường</h3>
          <span className="stat-number">{users.filter(u => u.role === 'user').length}</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Tuổi</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  📭 Chưa có user nào trong hệ thống
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td>{user.age || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${layMauRole(user.role)}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="created-date">
                    {dinhDangNgay(user.createdAt)}
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => xoaUser(user._id, user.name)}
                      disabled={deleteLoading === user._id}
                    >
                      {deleteLoading === user._id ? '⏳' : '🗑️'} Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
