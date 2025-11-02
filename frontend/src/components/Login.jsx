import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // SV2: Redux hooks
import { loginUser } from '../store/thunks/authThunks'; // SV2: Redux thunk

export default function Login({ onLogin, onForgotPassword }) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth); // SV2: Get loading và error từ Redux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // SV2: Sử dụng Redux thunk để login
      const result = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(result)) {
        const { user } = result.payload;
        console.log('✅ Login successful with Redux');
        alert('Đăng nhập thành công!');
        if (onLogin) onLogin({ token: result.payload.accessToken, user });
      } else {
        // Error đã được xử lý trong thunk
        alert(error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login failed', err);
      alert(err?.message || 'Đăng nhập thất bại');
    }
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
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {!isLoading && (
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
