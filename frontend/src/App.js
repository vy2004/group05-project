frontend-auth
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./components/AppContent";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>

// 📁 src/App.jsx
import { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
frontend-profile
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/Profile";
import api from "./services/api";
main
import "./App.css";

function App() {
  // 🧠 State dùng làm "tín hiệu" reload danh sách user
  const [reloadSignal, setReloadSignal] = useState(false);

  // 🔁 Khi thêm user thành công → đảo trạng thái reloadSignal để UserList re-render
  const handleUserAdded = () => {
    setReloadSignal((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    api.setAuthToken(null);
    setToken(null);
  };

  // Nếu đã đăng nhập, hiển thị giao diện chính
  if (token) {
    return (
      <div className="App" style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#f0f2f5',
        paddingBottom: '40px'
      }}>
        <div style={{
          width: '100%',
          background: 'white',
          padding: '12px 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px'
          }}>
            <h1 style={{ 
              fontSize: '20px',
              margin: 0,
              color: '#1976d2'
            }}>
              Thông Tin Cá Nhân
            </h1>
            <button 
              onClick={handleLogout}
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

        <Profile isAuthenticated={true} />
      </div>
    );
  }

  // Nếu chưa đăng nhập, hiển thị form đăng nhập/đăng ký
  return (
frontend-profile
    <div className="App" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '30px 40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
            localStorage.setItem('jwt_token', token);
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
          <>
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
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
      {token && <Profile isAuthenticated={true} />}

    <div style={{ padding: 20 }}>
      <h1>📚 Quản lý User (Frontend React + MongoDB)</h1>

      {/* 🧩 Form thêm user (truyền callback để báo cho App biết khi thêm user mới) */}
      <AddUser onUserAdded={handleUserAdded} />

      {/* 🧩 Danh sách user (tự reload mỗi khi reloadSignal thay đổi) */}
      <UserList fetchUsersSignal={reloadSignal} />
 main
    </div>
 main
  );
}

export default App;