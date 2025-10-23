import { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.token;
      const user = res.data?.user;
      if (token && user) {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        alert('Đăng nhập thành công!');
        if (onLogin) onLogin({ token, user });
      } else {
        alert('Không nhận được token hoặc thông tin user từ server');
      }
    } catch (err) {
      console.error('Login failed', err);
      alert(err?.response?.data?.message || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <input
          id="login-email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            marginBottom: '12px'
          }}
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            marginBottom: '12px'
          }}
        />
      </div>
      <button
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
      {!loading && (
        <div style={{ marginTop: 12, textAlign: 'center', color: '#6c757d', fontSize: '0.9em' }}>
          <div>Vui lòng đăng nhập để tiếp tục.</div>
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9em',
                marginTop: '8px'
              }}
            >
              🔐 Quên mật khẩu?
            </button>
          )}
        </div>
      )}
    </form>
  );
}
