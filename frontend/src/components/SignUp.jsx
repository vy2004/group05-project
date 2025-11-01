import { useState } from 'react';
import api from '../services/api';

export default function SignUp({ onSignedUp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      alert(res.data?.message || 'Đăng ký thành công');
      setName(''); setEmail(''); setPassword('');
      if (onSignedUp) onSignedUp();
    } catch (err) {
      console.error('Signup error', err);
      alert(err?.response?.data?.message || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Tên"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            marginBottom: '12px'
          }}
        />
        <input
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
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  );
}
