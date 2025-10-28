import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Token không hợp lệ hoặc không có trong URL');
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/password/reset', {
        token,
        newPassword
      });
      
      if (response.data.success) {
        setIsSuccess(true);
        setMessage(response.data.message);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Lỗi reset mật khẩu:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>🔑 Đặt Lại Mật Khẩu</h2>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                disabled={isLoading}
                className={errors.newPassword ? 'error' : ''}
              />
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                disabled={isLoading}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || !token}
            >
              {isLoading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <p>{message}</p>
            <p className="instruction">
              Mật khẩu của bạn đã được đặt lại thành công. 
              Bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>
        )}

        {message && !isSuccess && (
          <div className="error-message">
            ❌ {message}
          </div>
        )}

        <div className="action-buttons">
          <button 
            type="button" 
            className="back-btn"
            onClick={handleBackToLogin}
          >
            ← Quay lại đăng nhập
          </button>
          
          {isSuccess && (
            <button 
              type="button" 
              className="login-btn"
              onClick={handleBackToLogin}
            >
              Đăng nhập ngay →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;











