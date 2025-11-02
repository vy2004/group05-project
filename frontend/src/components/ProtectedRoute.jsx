// frontend/src/components/ProtectedRoute.jsx
// SV2: Protected Route component để chặn truy cập nếu chưa đăng nhập

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { checkAuth } from '../store/thunks/authThunks';

/**
 * SV2: ProtectedRoute - Bảo vệ routes yêu cầu authentication
 * 
 * @param {React.ReactNode} children - Component con cần được bảo vệ
 * @param {string[]} allowedRoles - Các roles được phép truy cập (optional)
 * @param {boolean} requireAuth - Yêu cầu authentication (default: true)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Thử check auth từ localStorage
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  // Nếu đang loading, hiển thị loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Đang kiểm tra quyền truy cập...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Vui lòng đợi...</div>
      </div>
    );
  }

  // Nếu yêu cầu authentication nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated) {
    // Redirect về login với returnUrl
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu về role
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // User không có quyền truy cập
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h2>403 - Không có quyền truy cập</h2>
          <p>Bạn không có quyền truy cập trang này.</p>
          <p>Yêu cầu role: {allowedRoles.join(', ')}</p>
          <p>Role hiện tại: {user.role}</p>
        </div>
      );
    }
  }

  // Có quyền truy cập, render children
  return children;
};

export default ProtectedRoute;

