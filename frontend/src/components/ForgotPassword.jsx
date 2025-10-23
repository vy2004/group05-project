import React, { useState } from 'react';
import api from '../services/api';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin, onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/password/forgot', { email });
      
      if (response.data.success) {
        setIsSuccess(true);
        setMessage(response.data.message);
        setEmail('');
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Lỗi gửi email reset:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>🔐 Quên Mật Khẩu</h2>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email của bạn:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email để nhận link reset mật khẩu"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi Email Reset'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <p>{message}</p>
            <p className="instruction">
              Vui lòng kiểm tra hộp thư của bạn và click vào link để reset mật khẩu.
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
            onClick={onBackToLogin}
          >
            ← Quay lại đăng nhập
          </button>
          
          {isSuccess && (
            <button 
              type="button" 
              className="reset-btn"
              onClick={onResetPassword}
            >
              Đặt lại mật khẩu →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


