// frontend/src/store/thunks/authThunks.js
// SV2: Redux thunks để gọi API authentication

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import {
  setLoading,
  setError,
  loginSuccess,
  refreshToken as refreshTokenAction,
  logout as logoutAction,
  updateUser,
} from '../slices/authSlice';

/**
 * SV2: Thunk để login
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken: refreshTokenValue, user } = response.data;

      if (accessToken && refreshTokenValue && user) {
        // Lưu refresh token
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', refreshTokenValue);
        }

        // Set token vào axios headers
        api.setAuthToken(accessToken);

        // Dispatch login success
        dispatch(loginSuccess({ token: accessToken, user }));

        return { accessToken, refreshToken: refreshTokenValue, user };
      } else {
        throw new Error('Không nhận được token hoặc thông tin user từ server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * SV2: Thunk để logout
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Gọi API logout để revoke refresh token
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear axios header
      api.setAuthToken(null);
      
      // Dispatch logout action
      dispatch(logoutAction());
    }
  }
);

/**
 * SV2: Thunk để refresh token
 */
export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      if (!refreshTokenValue) {
        throw new Error('Không có refresh token');
      }

      const response = await api.post('/auth/refresh', {
        refreshToken: refreshTokenValue,
      });

      const { accessToken, refreshToken: newRefreshToken, user } = response.data;

      // Lưu tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        if (user) {
          localStorage.setItem('current_user', JSON.stringify(user));
          dispatch(updateUser(user));
        }
      }

      // Update axios headers
      api.setAuthToken(accessToken);

      // Dispatch refresh token action
      dispatch(refreshTokenAction({ token: accessToken }));

      return { accessToken, refreshToken: newRefreshToken, user };
    } catch (error) {
      // Nếu refresh thất bại, logout user
      dispatch(logoutUser());
      return rejectWithValue(error.response?.data?.message || 'Refresh token thất bại');
    }
  }
);

/**
 * SV2: Thunk để kiểm tra authentication status
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('current_user');
      
      if (!token || !userStr) {
        throw new Error('Không có token hoặc user info');
      }

      const user = JSON.parse(userStr);
      
      // Set token vào axios headers
      api.setAuthToken(token);

      // Verify token bằng cách gọi API profile
      try {
        await api.get('/profile');
        
        // Token hợp lệ
        dispatch(loginSuccess({ token, user }));
        return { token, user };
      } catch (error) {
        // Token không hợp lệ, thử refresh
        if (error.response?.status === 401) {
          return dispatch(refreshUserToken());
        }
        throw error;
      }
    } catch (error) {
      // Không có token hoặc token không hợp lệ
      dispatch(logoutAction());
      return rejectWithValue(error.message || 'Chưa đăng nhập');
    }
  }
);

/**
 * SV2: Thunk để signup
 */
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await api.post('/auth/signup', userData);
      
      // Signup thành công, tự động login
      if (response.data.user) {
        const { email, password } = userData;
        return dispatch(loginUser({ email, password }));
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

