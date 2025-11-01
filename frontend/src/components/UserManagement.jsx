import React, { useState } from 'react';
import AddUser from './AddUser';
import UserList from './UserList';

const UserManagement = ({ showMenu, setShowMenu, setCurrentView, setProfileKey, handleLogout, currentUser }) => {
  const [reloadSignal, setReloadSignal] = useState(0);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Menu ở trên cùng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#333' }}>👥 Quản Lý User</h1>
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

      <div style={{
        background: 'white',
        padding: '30px 40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {currentUser?.role === 'admin' && (
          <AddUser onUserAdded={() => setReloadSignal(prev => prev + 1)} />
        )}
        <UserList reloadSignal={reloadSignal} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default UserManagement;

