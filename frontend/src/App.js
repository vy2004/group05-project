import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import api from "./services/api";
import "./App.css";

function App() {
  const [reloadSignal, setReloadSignal] = useState(0);
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null));
  const [isLogin, setIsLogin] = useState(true); // true = show login, false = show signup

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <div style={{
        background: 'white',
        padding: '30px 40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '24px',
          marginBottom: '24px',
          color: '#1a1a1a'
        }}>Quản lý người dùng</h1>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          marginBottom: '20px' 
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '8px',
              background: isLogin ? '#007bff' : '#e9ecef',
              color: isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '8px',
              background: !isLogin ? '#007bff' : '#e9ecef',
              color: !isLogin ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Đăng ký
          </button>
        </div>

        {isLogin ? (
          <Login onLogin={({ token, user }) => { 
            api.setAuthToken(token); 
            setToken(token);
          }} />
        ) : (
          <SignUp onSignedUp={() => {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            setIsLogin(true);
          }} />
        )}

        {token && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ color: '#0f5132', background: '#d1e7dd', padding: 8, borderRadius: 4, marginBottom: 8 }}>
              Đã đăng nhập thành công!
            </div>
            <button 
              onClick={() => { 
                localStorage.removeItem('jwt_token'); 
                api.setAuthToken(null); 
                setToken(null);
              }}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;