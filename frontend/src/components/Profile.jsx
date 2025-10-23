import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

const Profile = ({ currentUser, onUserUpdate }) => {
  const [user, setUser] = useState(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || ''
  });

  // Auto-load profile data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setProfileLoading(true);
        const response = await api.get('/profile');
        const profileData = response.data.user;
        
        // Update state with fresh data
        setUser(profileData);
        setFormData({
          name: profileData?.name || '',
          email: profileData?.email || '',
          age: profileData?.age || ''
        });
        
        // Update localStorage with fresh data
        localStorage.setItem('current_user', JSON.stringify(profileData));
        
        // Notify parent component
        if (onUserUpdate) {
          onUserUpdate(profileData);
        }
      } catch (error) {
        console.error('Lỗi khi load profile data:', error);
        setProfileError(error.response?.data?.message || 'Không thể tải thông tin profile');
        
        // Fallback to currentUser if API fails
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            age: currentUser?.age || ''
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    // Only load if we have a token (user is logged in)
    const token = localStorage.getItem('jwt_token');
    if (token) {
      loadProfileData();
    } else {
      setProfileLoading(false);
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Update form data when user changes (for editing mode)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || ''
    });
  }, [user]);

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

  // Show loading state while fetching profile data
  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '20px',
              animation: 'spin 1s linear infinite'
            }}>
              ⏳
            </div>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Đang tải thông tin profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if profile loading failed
  if (profileError && !user) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              color: '#e74c3c'
            }}>
              ❌
            </div>
            <p style={{ fontSize: '1.1rem', color: '#e74c3c', marginBottom: '20px' }}>
              {profileError}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '10px 20px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 Hồ Sơ Cá Nhân</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
        {profileError && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            color: '#856404',
            padding: '10px 15px',
            borderRadius: '5px',
            marginTop: '15px',
            fontSize: '0.9rem'
          }}>
            ⚠️ Không thể tải dữ liệu mới nhất: {profileError}. Đang hiển thị dữ liệu đã lưu.
          </div>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
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
                  <label>Avatar:</label>
                  <span>{user?.avatar ? '✅ Đã cập nhật' : '❌ Chưa cập nhật'}</span>
                </div>
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
