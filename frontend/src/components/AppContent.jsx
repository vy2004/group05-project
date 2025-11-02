import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import RoleManagement from "./RoleManagement";
import UserManagement from "./UserManagement";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UploadAvatar from "./UploadAvatar";
import Permissions from "./Permissions";
import ProtectedRoute from "./ProtectedRoute"; // SV2: Protected Route
import AdminPanel from "./AdminPanel"; // For admin panel
import ActivityLogs from "./ActivityLogs"; // SV2: Activity logs component
import api from "../services/api";
import { useAppSelector, useAppDispatch } from "../store/hooks"; // SV2: Redux hooks
import { logoutUser, checkAuth } from "../store/thunks/authThunks"; // SV2: Redux thunks

// Component để redirect /login về /
function LoginRedirect() {
  return <Navigate to="/" replace />;
}

function AppContent() {
  // SV2: Redux hooks
  const dispatch = useAppDispatch();
  const { isAuthenticated, user: reduxUser, token: reduxToken } = useAppSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const [profileKey, setProfileKey] = useState(0); // Để force reload Profile
  // SV2: Sử dụng Redux state, fallback về localStorage cho backward compatibility
  const token = reduxToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  const currentUser = reduxUser || (() => {
    // Fallback cho backward compatibility
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  })();
  const [isLogin, setIsLogin] = useState(true); // true = show login, false = show signup
  // Legacy state để tương thích (sẽ được sync với Redux)
  const [, setToken] = useState(token);
  const [, setCurrentUserState] = useState(currentUser);
  
  // Helper để sync cả Redux và legacy state
  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    // Redux sẽ tự sync qua loginSuccess action
  };
  const [currentView, setCurrentView] = useState(() => {
    // Xác định view ban đầu dựa trên role của user đã lưu
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return (user.role === 'admin' || user.role === 'moderator') ? 'role' : 'user';
      }
    }
    return 'auth';
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // SV2: Kiểm tra auth khi app khởi động với Redux
  useEffect(() => {
    // Check auth từ Redux store
    if (!isAuthenticated && token) {
      dispatch(checkAuth());
    } else if (token) {
      api.setAuthToken(token);
      console.log('✅ Restored access token from localStorage');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hiển thị thông báo đăng nhập thành công 5 giây
  useEffect(() => {
    if (showLoginSuccess) {
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLoginSuccess]);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // SV2: Sử dụng Redux thunk cho logout
  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    // Reset local state (backward compatibility)
    setToken(null);
    setCurrentUser(null);
    setCurrentView('auth');
    navigate('/');
    console.log('✅ Logged out successfully');
  }, [dispatch, navigate]);

  // SV2: Auto clear invalid tokens - sử dụng Redux checkAuth
  useEffect(() => {
    if (token && !isAuthenticated) {
      // Check auth với Redux
      dispatch(checkAuth());
    }
  }, [token, isAuthenticated, dispatch]);

  const handleAvatarUpdate = (updatedUser) => {
    console.log('📥 AppContent received avatar update:', updatedUser);
    // SV2: Update cả Redux và local state
    setCurrentUserState(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
    }
    console.log('✅ AppContent updated currentUser state');
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      {/* Toast notification đăng nhập thành công */}
      {showLoginSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          color: '#0f5132',
          background: '#d1e7dd',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✅ Đã đăng nhập thành công! 
          {currentUser && (
            <span>
              ({currentUser.role === 'admin' ? '👑 Admin' : currentUser.role === 'moderator' ? '🛡️ Moderator' : '👤 User'}: {currentUser.name})
            </span>
          )}
        </div>
      )}
      
      {/* Route cho Reset Password */}
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Route cho /login - redirect to home */}
        <Route path="/login" element={<LoginRedirect />} />
        
        {/* SV2: Protected Route cho /profile - Yêu cầu authentication */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireAuth={true}>
              <div style={{ width: '100%', marginTop: '20px' }}>
                <Profile 
                  key={`profile-${profileKey}`}
                  currentUser={currentUser} 
                  onUserUpdate={handleAvatarUpdate}
                  setCurrentView={setCurrentView}
                />
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* SV2: Protected Route cho /admin - Chỉ Admin mới vào được */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
              <div style={{ width: '100%', marginTop: '20px' }}>
                <AdminPanel 
                  currentUser={currentUser}
                  setCurrentView={setCurrentView}
                  handleLogout={handleLogout}
                />
              </div>
            </ProtectedRoute>
          } 
        />
        
        {/* Route cho trang chính */}
        <Route path="/" element={
          <>
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
                
                {!showForgotPassword ? (
                  <>
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
                      <Login 
                        onLogin={({ token, user }) => { 
                          api.setAuthToken(token); 
                          setToken(token);
                          setCurrentUser(user);
                          setShowLoginSuccess(true);
                          // Xác định view dựa trên role
                          setCurrentView((user.role === 'admin' || user.role === 'moderator') ? 'role' : 'user');
                          // SV2: Sync với Redux (đã được xử lý trong thunk)
                        }} 
                        onForgotPassword={() => setShowForgotPassword(true)}
                      />
                    ) : (
                      <SignUp onSignedUp={() => {
                        alert('Đăng ký thành công! Vui lòng đăng nhập.');
                        setIsLogin(true);
                      }} />
                    )}
                  </>
                ) : (
                  <ForgotPassword 
                    onBackToLogin={() => setShowForgotPassword(false)}
                    onResetPassword={() => {
                      alert('Vui lòng kiểm tra email để lấy link reset mật khẩu.');
                    }}
                  />
                )}
              </div>
            )}

            {/* Hiển thị RoleManagement hoặc UserManagement hoặc UploadAvatar dựa trên currentView */}
            {token && currentView === 'role' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <RoleManagement 
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  setCurrentView={setCurrentView}
                  setProfileKey={setProfileKey}
                  handleLogout={handleLogout}
                  currentUser={currentUser}
                />
              </div>
            )}

            {token && currentView === 'usermgmt' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <UserManagement 
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  setCurrentView={setCurrentView}
                  setProfileKey={setProfileKey}
                  handleLogout={handleLogout}
                  currentUser={currentUser}
                />
              </div>
            )}

            {token && currentView === 'user' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', padding: '0 20px' }}>
                  <div className="menu-container" style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ☰
                    </button>
                    {showMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '200px'
                      }}>
                        {currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => {
                              setCurrentView('role');
                              setShowMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            🔧 Quản Lý Phân Quyền
                          </button>
                        )}
                        {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                          <button 
                            onClick={() => {
                              setCurrentView('usermgmt');
                              setShowMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            👥 Quản Lý User
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setCurrentView('permissions');
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          🔐 Quyền hạn
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentView('user');
                            setProfileKey(prev => prev + 1);
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          ℹ️ Thông tin
                        </button>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: '#dc3545',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          🚪 Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <Profile 
                  key={`profile-${profileKey}`}
                  currentUser={currentUser} 
                  onUserUpdate={handleAvatarUpdate}
                  setCurrentView={setCurrentView}
                />
              </div>
            )}

            {token && currentView === 'avatar' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <UploadAvatar 
                  currentUser={currentUser} 
                  onAvatarUpdate={handleAvatarUpdate}
                  setCurrentView={setCurrentView}
                  onUploadSuccess={() => {
                    // Sau khi upload thành công, chuyển sang tab Profile
                    console.log('✅ Upload success! Switching to Profile tab...');
                    setCurrentView('user');
                    setProfileKey(prev => prev + 1); // Force reload Profile
                  }}
                />
              </div>
            )}

            {token && currentView === 'permissions' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', padding: '0 20px' }}>
                  <div className="menu-container" style={{ position: 'relative' }}>
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ☰
                    </button>
                    {showMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '200px'
                      }}>
                        {currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => {
                              setCurrentView('role');
                              setShowMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            🔧 Quản Lý Phân Quyền
                          </button>
                        )}
                        {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                          <button 
                            onClick={() => {
                              setCurrentView('usermgmt');
                              setShowMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            👥 Quản Lý User
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setCurrentView('permissions');
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          🔐 Quyền hạn
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => {
                              setCurrentView('logs');
                              setShowMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                          >
                            📊 Xem Log
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setCurrentView('user');
                            setProfileKey(prev => prev + 1);
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          ℹ️ Thông tin
                        </button>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            background: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: '#dc3545',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          🚪 Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <Permissions 
                  currentUser={currentUser}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  setCurrentView={setCurrentView}
                  setProfileKey={setProfileKey}
                  handleLogout={handleLogout}
                />
              </div>
            )}

            {/* SV2: Hiển thị Activity Logs khi Admin click "Xem Log" */}
            {token && currentView === 'logs' && currentUser?.role === 'admin' && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <ActivityLogs 
                  currentUser={currentUser}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  setCurrentView={setCurrentView}
                  setProfileKey={setProfileKey}
                  handleLogout={handleLogout}
                />
              </div>
            )}
          </>
        } />
      </Routes>
    </div>
  );
}

export default AppContent;
