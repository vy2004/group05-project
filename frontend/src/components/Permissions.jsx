import React from 'react';
import './Permissions.css';

const Permissions = ({ currentUser, showMenu, setShowMenu, setCurrentView, setProfileKey, handleLogout }) => {
  // Định nghĩa quyền cho từng role
  const getRolePermissions = (role) => {
    switch (role) {
      case 'admin':
        return {
          description: 'Admin: Bạn có toàn quyền quản lý hệ thống, có thể thêm, sửa, xóa user và phân quyền.',
          permissions: [
            { name: 'Có thể xem hồ sơ của chính mình', granted: true },
            { name: 'Có thể chỉnh sửa hồ sơ của chính mình', granted: true },
            { name: 'Có thể xóa tài khoản của chính mình', granted: true },
            { name: 'Có thể xem tất cả người dùng', granted: true },
            { name: 'Có thể chỉnh sửa người dùng khác', granted: true },
            { name: 'Có thể xóa người dùng khác', granted: true },
            { name: 'Có thể quản lý vai trò', granted: true },
            { name: 'Có thể thêm người dùng mới', granted: true }
          ]
        };
      case 'moderator':
        return {
          description: 'Moderator: Bạn có quyền xem và chỉnh sửa thông tin của user thường, nhưng không thể thêm, xóa hoặc thay đổi role.',
          permissions: [
            { name: 'Có thể xem hồ sơ của chính mình', granted: true },
            { name: 'Có thể chỉnh sửa hồ sơ của chính mình', granted: true },
            { name: 'Có thể xóa tài khoản của chính mình', granted: true },
            { name: 'Có thể xem user thường', granted: true },
            { name: 'Có thể chỉnh sửa user thường', granted: true },
            { name: 'Có thể xóa người dùng khác', granted: false },
            { name: 'Có thể quản lý vai trò', granted: false },
            { name: 'Có thể thêm người dùng mới', granted: false }
          ]
        };
      default:
        return {
          description: 'User: Bạn chỉ có quyền xem và chỉnh sửa thông tin cá nhân của mình.',
          permissions: [
            { name: 'Có thể xem hồ sơ của chính mình', granted: true },
            { name: 'Có thể chỉnh sửa hồ sơ của chính mình', granted: true },
            { name: 'Có thể xóa tài khoản của chính mình', granted: true },
            { name: 'Có thể xem tất cả người dùng', granted: false },
            { name: 'Có thể chỉnh sửa người dùng khác', granted: false },
            { name: 'Có thể xóa người dùng khác', granted: false },
            { name: 'Có thể quản lý vai trò', granted: false },
            { name: 'Có thể thêm người dùng mới', granted: false }
          ]
        };
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return '👑 Admin';
      case 'moderator':
        return '🛡️ Moderator';
      default:
        return '👤 User';
    }
  };

  const roleData = getRolePermissions(currentUser?.role);
  const roleDisplayName = getRoleDisplayName(currentUser?.role);

  return (
    <div className="permissions-container">
      <div className="permissions-card">
        <h2 className="permissions-title">Quyền Hạn Của Bạn</h2>
        
        <div className="current-role-section">
          <span className="role-label">Role hiện tại:</span>
          <span className="role-badge">{roleDisplayName}</span>
        </div>

        <div className="permissions-details">
          <h3>Chi tiết quyền:</h3>
          <div className="permissions-list">
            {roleData.permissions.map((permission, index) => (
              <div key={index} className="permission-item">
                <span className="permission-name">{permission.name}</span>
                <span className={`permission-status ${permission.granted ? 'granted' : 'denied'}`}>
                  {permission.granted ? (
                    <>
                      <span className="status-icon">✓</span>
                      <span className="status-text">Có</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">✗</span>
                      <span className="status-text">Không</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="permission-note">
          <span className="note-icon">💡</span>
          <p>{roleData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Permissions;

