import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', age: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const batDauEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    });
  };

  const huyEdit = () => {
    setEditingUser(null);
    setEditFormData({ name: '', email: '', age: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const capNhatUser = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      const response = await updateUser(editingUser._id, editFormData);
      
      // Cập nhật danh sách user
      setUsers(users.map(u => 
        u._id === editingUser._id ? response.user : u
      ));
      
      alert('Cập nhật user thành công!');
      huyEdit();
    } catch (err) {
      console.error('Lỗi khi cập nhật user:', err);
      alert(err.response?.data?.message || 'Không thể cập nhật user');
    } finally {
      setUpdateLoading(false);
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
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="btn-edit"
                        onClick={() => batDauEdit(user)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => xoaUser(user._id, user.name)}
                        disabled={deleteLoading === user._id}
                      >
                        {deleteLoading === user._id ? '⏳' : '🗑️'} Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit User */}
      {editingUser && (
        <div className="modal-overlay" onClick={huyEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Chỉnh sửa thông tin User</h2>
              <button className="modal-close" onClick={huyEdit}>✕</button>
            </div>
            
            <form onSubmit={capNhatUser} className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">Tên *</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  placeholder="Nhập tên"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email *</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                  placeholder="Nhập email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-age">Tuổi</label>
                <input
                  type="number"
                  id="edit-age"
                  name="age"
                  value={editFormData.age}
                  onChange={handleEditChange}
                  placeholder="Nhập tuổi"
                  min="1"
                  max="120"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={huyEdit}
                  disabled={updateLoading}
                >
                  ❌ Hủy
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={updateLoading}
                >
                  {updateLoading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
