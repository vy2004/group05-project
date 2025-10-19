import React, { useState, useEffect } from 'react';
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
      ...prev,
      [name]: value
    }));
  };

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