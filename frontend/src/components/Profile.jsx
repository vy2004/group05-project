import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

const Profile = ({ currentUser, onUserUpdate }) => {
  const [user, setUser] = useState(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || ''
  });

  useEffect(() => {
    setUser(currentUser);
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      age: currentUser?.age || ''
    });
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put(`/profile`, formData);
      const updatedUser = response.data.user;
      
      // Cập nhật localStorage
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      // Cập nhật state
      setUser(updatedUser);
      setIsEditing(false);
      
      // Thông báo cho component cha
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || ''
    });
    setIsEditing(false);
  };

  const dinhDangNgay = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 Hồ Sơ Cá Nhân</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="role-badge">
              {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <div className="info-section">
                <h3>Thông tin cơ bản</h3>
                <div className="info-item">
                  <label>Tên:</label>
                  <span>{user?.name || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <label>Tuổi:</label>
                  <span>{user?.age || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <label>Vai trò:</label>
                  <span className={`role-text ${user?.role === 'admin' ? 'admin' : 'user'}`}>
                    {user?.role === 'admin' ? '👑 Quản trị viên' : '👤 Người dùng'}
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h3>Thông tin tài khoản</h3>
                <div className="info-item">
                  <label>ID:</label>
                  <span className="user-id">{user?.id || user?._id}</span>
                </div>
                <div className="info-item">
                  <label>Ngày tạo:</label>
                  <span>{user?.createdAt ? dinhDangNgay(user.createdAt) : 'Không xác định'}</span>
                </div>
                <div className="info-item">
                  <label>Cập nhật lần cuối:</label>
                  <span>{user?.updatedAt ? dinhDangNgay(user.updatedAt) : 'Không xác định'}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Chỉnh sửa thông tin</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email của bạn"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Tuổi</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Nhập tuổi của bạn"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ❌ Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={loading}
                >
                  {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h4>📊 Thống kê tài khoản</h4>
            <div className="stat-item">
              <span>Thời gian tham gia:</span>
              <span>{user?.createdAt ? 
                Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + ' ngày' 
                : 'Không xác định'}</span>
            </div>
            <div className="stat-item">
              <span>Trạng thái:</span>
              <span className="status-active">🟢 Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
