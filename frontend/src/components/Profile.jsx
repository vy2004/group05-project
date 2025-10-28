import React, { useState, useEffect } from 'react';
frontend-profile
import { getProfile, updateProfile } from '../services/api';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Snackbar, 
  Alert,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Profile = ({ isAuthenticated }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    age: '',
    createdAt: '',
    updatedAt: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const userData = await getProfile();
      setProfile({
        ...userData,
        createdAt: new Date(userData.createdAt).toLocaleDateString('vi-VN'),
        updatedAt: new Date(userData.updatedAt).toLocaleDateString('vi-VN')
      });
    } catch (error) {
      showNotification('Không thể tải thông tin người dùng', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, age } = profile;
      const updatedProfile = {
        name,
        email,
        age: age === '' ? null : Number(age) // Gửi null nếu trường tuổi trống
      };
      await updateProfile(updatedProfile);
      setIsEditing(false);
      showNotification('Cập nhật thông tin thành công!', 'success');
      loadProfile(); // Tải lại thông tin sau khi cập nhật
    } catch (error) {
      showNotification('Không thể cập nhật thông tin. Vui lòng thử lại!', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({

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
 main
      ...prev,
      [name]: value
    }));
  };

frontend-profile
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile();
    showNotification('Đã hủy thay đổi', 'info');
  };

  if (!isAuthenticated) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ color: '#1976d2' }}>
            Thông Tin Cá Nhân
          </Typography>
          <Chip
            icon={profile.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
            label={profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            color={profile.role === 'admin' ? 'secondary' : 'primary'}
            variant="outlined"
          />
        </Box>
        <Divider sx={{ mb: 4 }} />

        {!isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Họ và tên
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.email}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tuổi
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.age || 'Chưa cập nhật'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Ngày tạo tài khoản
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.createdAt}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.updatedAt}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Tuổi"
                  name="age"
                  value={profile.age === null ? '' : profile.age}
                  onChange={handleInputChange}
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0, max: 150 }}
                  helperText="Nhập tuổi của bạn (không bắt buộc)"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày tạo tài khoản
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile.createdAt}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cập nhật lần cuối
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile.updatedAt}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              startIcon={<span role="img" aria-label="edit">✏️</span>}
            >
              Cập Nhật Thông Tin
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={<span role="img" aria-label="save">💾</span>}
              >
                Lưu Thay Đổi
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                startIcon={<span role="img" aria-label="cancel">❌</span>}
              >
                Hủy
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;

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

  // Debug: Log user state
  console.log('🖼️ Profile render - user:', user);
  console.log('🖼️ Profile render - avatar URL:', user?.avatar);

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
 main
