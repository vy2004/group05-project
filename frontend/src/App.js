import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Profile from "./components/Profile";
import api from "./services/api";
import "./App.css";

function App() {
  const [reloadSignal, setReloadSignal] = useState(0);
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null));
  const [isLogin, setIsLogin] = useState(true); // true = show login, false = show signup
  const [currentUser, setCurrentUser] = useState(() => {
    // Khôi phục thông tin user từ localStorage khi khởi động
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [currentView, setCurrentView] = useState(() => {
    // Xác định view ban đầu dựa trên role của user đã lưu
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return user.role === 'admin' ? 'admin' : 'user';
      }
    }
    return 'auth';
  });

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      {/* Hiển thị giao diện đăng nhập/đăng ký khi chưa đăng nhập */}
      {!token && (
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
              setCurrentUser(user);
              // Xác định view dựa trên role
              setCurrentView(user.role === 'admin' ? 'admin' : 'user');
            }} />
          ) : (
            <SignUp onSignedUp={() => {
              alert('Đăng ký thành công! Vui lòng đăng nhập.');
              setIsLogin(true);
            }} />
          )}
        </div>
      )}

      {/* Hiển thị thanh điều hướng khi đã đăng nhập */}
      {token && (
        <div style={{
          background: 'white',
          padding: '20px 40px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '20px',
          width: '100%',
          maxWidth: '1200px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ color: '#0f5132', background: '#d1e7dd', padding: 8, borderRadius: 4, marginBottom: 8 }}>
              Đã đăng nhập thành công! 
              {currentUser && (
                <span style={{ marginLeft: 8 }}>
                  ({currentUser.role === 'admin' ? '👑 Admin' : '👤 User'}: {currentUser.name})
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: 10 }}>
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => setCurrentView('admin')}
                  style={{
                    background: currentView === 'admin' ? '#007bff' : '#e9ecef',
                    color: currentView === 'admin' ? 'white' : '#333',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🔧 Admin Panel
                </button>
              )}
              <button 
                onClick={() => setCurrentView('user')}
                style={{
                  background: currentView === 'user' ? '#007bff' : '#e9ecef',
                  color: currentView === 'user' ? 'white' : '#333',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {currentUser?.role === 'admin' ? '👥 Quản lý User' : '👤 Hồ sơ cá nhân'}
              </button>
            </div>
            <button 
              onClick={() => { 
                localStorage.removeItem('jwt_token'); 
                localStorage.removeItem('current_user');
                api.setAuthToken(null); 
                setToken(null);
                setCurrentUser(null);
                setCurrentView('auth');
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
        </div>
      )}

      {/* Hiển thị AdminPanel hoặc UserList dựa trên currentView */}
      {token && currentView === 'admin' && (
        <div style={{ width: '100%', marginTop: '20px' }}>
          <AdminPanel />
        </div>
      )}

      {token && currentView === 'user' && (
        <div style={{ width: '100%', marginTop: '20px' }}>
          {currentUser?.role === 'admin' ? (
            <div style={{
              background: 'white',
              padding: '30px 40px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <AddUser onUserAdded={() => setReloadSignal(prev => prev + 1)} />
              <UserList reloadSignal={reloadSignal} />
            </div>
          ) : (
            <Profile 
              currentUser={currentUser} 
              onUserUpdate={(updatedUser) => {
                setCurrentUser(updatedUser);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;