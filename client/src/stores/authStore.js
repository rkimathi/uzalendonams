import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,

  login: async (credentials, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token, refreshToken } = response.data;
      
      // Store authentication data based on rememberMe preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
      storage.setItem('token', token);
      
      if (refreshToken) {
        storage.setItem('refreshToken', refreshToken);
      }
      
      set({ user, token, refreshToken, loading: false });
      toast.success('Login successful');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      toast.success('Registration successful. Please login.');
      set({ loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  logout: () => {
    // Clear both localStorage and sessionStorage to ensure all auth data is removed
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    
    set({ user: null, token: null, refreshToken: null });
    toast.success('Logged out successfully');
  },

  updateProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put('/users/profile', userData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ user: updatedUser, loading: false });
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  checkAuth: async () => {
    // Check both localStorage and sessionStorage for tokens
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      
      // Update the user in the same storage that has the token
      if (localStorage.getItem('token')) {
        localStorage.setItem('user', JSON.stringify(user));
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
      
      set({ user });
      return true;
    } catch (error) {
      // Only clear if it's not a network error (could be offline)
      if (error.response) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        
        set({ user: null, token: null, refreshToken: null });
      }
      return false;
    }
  },
  
  refreshAuthToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { token, newRefreshToken } = response.data;
      
      // Update tokens in the same storage that has the current tokens
      if (localStorage.getItem('refreshToken')) {
        localStorage.setItem('token', token);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
      } else if (sessionStorage.getItem('refreshToken')) {
        sessionStorage.setItem('token', token);
        if (newRefreshToken) sessionStorage.setItem('refreshToken', newRefreshToken);
      }
      
      set({ token, refreshToken: newRefreshToken || refreshToken });
      return true;
    } catch (error) {
      // If refresh fails, log the user out
      useAuthStore.getState().logout();
      return false;
    }
  },
  
  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/forgot-password', { email });
      set({ loading: false });
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to process request';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  resetPassword: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      set({ loading: false });
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  }
}));