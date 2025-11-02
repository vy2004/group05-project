// frontend/src/store/slices/authSlice.js
// SV2: Redux slice cho authentication state management

import { createSlice } from '@reduxjs/toolkit';

// Initial state từ localStorage nếu có
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('current_user');
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      token: token || null,
      user: user,
      isAuthenticated: !!token && !!user,
      isLoading: false,
      error: null,
    };
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Login success
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
      }
    },
    // Update user info
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(state.user));
      }
    },
    // Refresh token
    refreshToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
      }
    },
    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  updateUser,
  refreshToken,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

