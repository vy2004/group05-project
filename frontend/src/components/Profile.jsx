import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

const Profile = ({ currentUser, onUserUpdate, setCurrentView }) => {
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
        console.log('🔄 Loading profile data from server...');
        setProfileLoading(true);
        const response = await api.get('/profile');
        const profileData = response.data.user;
        
        console.log('✅ Profile data loaded:', profileData);
        console.log('🖼️ Avatar URL:', profileData?.avatar);
        
        // Update state with fresh data
        setUser(profileData);
        setFormData({
          name: profileData?.name || '',
          email: profileData?.email || '',
          age: profileData?.age || ''
        });
        
        // Update localStorage with fresh data
        localStorage.setItem('current_user', JSON.stringify(profileData));
        
        // Notify parent component (nhưng không trigger re-render vòng lặp)
        // if (onUserUpdate) {
        //   onUserUpdate(profileData);
        // }
      } catch (error) {
        console.error('❌ Lỗi khi load profile data:', error);
        setProfileError(error.response?.data?.message || 'Không thể tải thông tin profile');
        
        // Fallback to localStorage if API fails
        const cachedUser = localStorage.getItem('current_user');
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            console.log('⚠️ Using cached user data:', parsedUser);
            setUser(parsedUser);
            setFormData({
              name: parsedUser?.name || '',
              email: parsedUser?.email || '',
              age: parsedUser?.age || ''
            });
          } catch (e) {
            console.error('❌ Error parsing cached user');
          }
        }
      } finally {
        setProfileLoading(false);
      }
    };

    // Always load profile data when component mounts
    const token = localStorage.getItem('jwt_token');
    if (token) {
      console.log('🚀 Profile component mounted, loading data...');
      loadProfileData();
    } else {
      console.log('⚠️ No token found');
      setProfileLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi component mount

  // Cập nhật khi currentUser prop thay đổi (sau khi upload avatar)
  useEffect(() => {
    // Luôn đọc lại từ localStorage để đảm bảo có data mới nhất
    const cachedUser = localStorage.getItem('current_user');
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        setUser(parsedUser);
        console.log('✅ Profile loaded user from localStorage:', parsedUser);
      } catch (e) {
        console.error('❌ Error parsing cached user:', e);
      }
    }
    
    // Nếu có currentUser prop thì ưu tiên dùng nó
    if (currentUser) {
      setUser(currentUser);
      console.log('✅ Profile updated from currentUser prop:', currentUser);
    }
  }, [currentUser]);

  // Đồng bộ từ localStorage khi quay lại trang hoặc sau khi upload avatar ở màn khác
  useEffect(() => {
    const applyLocalUser = () => {
      try {
        const cached = localStorage.getItem('current_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Nếu avatar hoặc thông tin khác thay đổi, cập nhật vào state
          setUser(prev => {
            if (!prev) return parsed;
            const changed = prev.avatar !== parsed.avatar || prev.name !== parsed.name || prev.email !== parsed.email || prev.age !== parsed.age;
            return changed ? parsed : prev;
          });
        }
      } catch (_) {}
    };

    // Áp dụng ngay khi mở component
    applyLocalUser();
    // Khi cửa sổ lấy lại focus (quay về từ trang Avatar)
    const onFocus = () => applyLocalUser();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

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
      <div className="profile-container-compact">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px'
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
      <div className="profile-container-compact">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px'
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

  // Debug: Log user state
  console.log('🖼️ Profile render - user:', user);
  console.log('🖼️ Profile render - avatar URL:', user?.avatar);

  return (
    <div className="profile-container-compact">
      {profileError && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '10px 15px',
          borderRadius: '5px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          maxWidth: '1200px',
          margin: '0 auto 20px'
        }}>
          ⚠️ Không thể tải dữ liệu mới nhất: {profileError}. Đang hiển thị dữ liệu đã lưu.
        </div>
      )}

      <div className="profile-content-compact">
        {!isEditing ? (
          <div className="profile-info-compact">
            {/* Left: Avatar Section */}
            <div className="profile-avatar-left">
              <div className="avatar-circle-left">
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
              <div className="avatar-actions">
                <button 
                  className="btn-choose-avatar"
                  onClick={() => setCurrentView('avatar')}
                >
                  Chọn ảnh
                </button>
              </div>
              <div className="avatar-helper-text">
                Kích thước tối ưu 300x300 px
              </div>
            </div>

            {/* Right: Info Section */}
            <div className="profile-details-right">
              <h2 className="profile-title">Thông tin cá nhân</h2>
              
              <div className="info-item-row">
                <label className="info-label">Họ và tên:</label>
                <span className="info-value">{user?.name || 'Chưa cập nhật'}</span>
              </div>

              <div className="info-item-row">
                <label className="info-label">Email:</label>
                <span className="info-value">{user?.email || 'Chưa cập nhật'}</span>
              </div>

              <div className="info-item-row">
                <label className="info-label">Tuổi:</label>
                <span className="info-value">{user?.age || 'Chưa cập nhật'}</span>
              </div>

              <div className="info-item-row">
                <label className="info-label">Vai trò:</label>
                <span className={`info-value role-text ${user?.role === 'admin' ? 'admin' : user?.role === 'moderator' ? 'moderator' : 'user'}`}>
                  {user?.role === 'admin' ? '👑 Quản trị viên' : user?.role === 'moderator' ? '🛡️ Điều hành viên' : '👤 Người dùng'}
                </span>
              </div>

              <div className="profile-actions-compact">
                <button 
                  className="btn-edit-compact"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-edit-layout">
            {/* Left: Avatar Section */}
            <div className="profile-avatar-left">
              <div className="avatar-circle-left">
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
              <div className="avatar-actions">
                <button 
                  className="btn-choose-avatar"
                  onClick={() => setCurrentView('avatar')}
                >
                  Chọn ảnh
                </button>
              </div>
              <div className="avatar-helper-text">
                Kích thước tối ưu 300x300 px
              </div>
            </div>

            {/* Right: Edit Form */}
            <div className="profile-details-right">
              <form className="profile-form-compact" onSubmit={handleSubmit}>
                <h2 className="profile-title">Chỉnh sửa thông tin</h2>
                
                <div className="form-group-compact">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="form-group-compact">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email"
                  />
                </div>

                <div className="form-group-compact">
                  <label htmlFor="age">Tuổi</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Nhập tuổi"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="form-actions-compact">
                  <button 
                    type="button" 
                    className="btn-cancel-compact"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    ❌ Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save-compact"
                    disabled={loading}
                  >
                    {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
