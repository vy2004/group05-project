import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser, updateUserRole } from '../services/api';
import './AdminPanel.css';

const AdminPanel = ({ showMenu, setShowMenu, setCurrentView, setProfileKey, handleLogout, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', age: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, admin, moderator, user

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

  // Format date function (có thể dùng sau)
  // const dinhDangNgay = (dateString) => {
  //   return new Date(dateString).toLocaleString('vi-VN');
  // };

  const layMauRole = (role) => {
    if (role === 'admin') return 'role-admin';
    if (role === 'moderator') return 'role-moderator';
    return 'role-user';
  };

  const layTenRole = (role) => {
    if (role === 'admin') return '👑 Admin';
    if (role === 'moderator') return '🛡️ Moderator';
    return '👤 User';
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Bạn có chắc chắn muốn đổi role thành ${newRole}?`)) {
      return;
    }

    try {
      const response = await updateUserRole(userId, newRole);
      alert(response.message || 'Cập nhật role thành công!');
      
      // Cập nhật danh sách user sau khi đổi role
      taiDanhSachUser();
    } catch (err) {
      console.error('Lỗi khi cập nhật role:', err);
      alert(err.response?.data?.message || 'Không thể cập nhật role');
    }
  };

  // Filter users theo role
  const filteredUsers = selectedFilter === 'all' 
    ? users 
    : users.filter(user => user.role === selectedFilter);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>🔧 Quản Lý Phân Quyền</h1>
        <div className="menu-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ☰
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '200px'
            }}>
              {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                <button 
                  onClick={() => {
                    setCurrentView('admin');
                    setShowMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  {currentUser?.role === 'admin' ? '🔧' : '🛡️'} {currentUser?.role === 'admin' ? 'Quản Lý Phân Quyền' : 'Quản Lý Phân Quyền'}
                </button>
              )}
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => {
                    setCurrentView('logs');
                    setShowMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  📊 Xem Log
                </button>
              )}
              <button 
                onClick={() => {
                  setCurrentView('user');
                  setProfileKey(prev => prev + 1);
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                ℹ️ Thông tin
              </button>
              <button 
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={taiDanhSachUser}>Thử lại</button>
        </div>
      )}

      <div className="users-stats">
        <div className="stat-card">
          <h3>TỔNG SỐ USER</h3>
          <span className="stat-number">{users.length}</span>
        </div>
        <div className="stat-card">
          <h3>ADMIN</h3>
          <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
        </div>
        <div className="stat-card">
          <h3>MODERATOR</h3>
          <span className="stat-number">{users.filter(u => u.role === 'moderator').length}</span>
        </div>
        <div className="stat-card">
          <h3>USER THƯỜNG</h3>
          <span className="stat-number">{users.filter(u => u.role === 'user').length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-container">
        <button
          className={`filter-tab ${selectedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-tab ${selectedFilter === 'admin' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('admin')}
        >
          Admin
        </button>
        <button
          className={`filter-tab ${selectedFilter === 'moderator' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('moderator')}
        >
          Moderator
        </button>
        <button
          className={`filter-tab ${selectedFilter === 'user' ? 'active' : ''}`}
          onClick={() => setSelectedFilter('user')}
        >
          User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN</th>
              <th>EMAIL</th>
              <th>TUỔI</th>
              <th>ROLE HIỆN TẠI</th>
              <th>THAY ĐỔI ROLE</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  📭 {users.length === 0 ? 'Chưa có user nào trong hệ thống' : 'Không có user nào khớp với bộ lọc'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td>{user.age || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${layMauRole(user.role)}`}>
                      {layTenRole(user.role)}
                    </span>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      value={user.role}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => batDauEdit(user)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete-small"
                        onClick={() => xoaUser(user._id, user.name)}
                        disabled={deleteLoading === user._id}
                        title="Xóa"
                      >
                        {deleteLoading === user._id ? '⏳' : '🗑️'}
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
