import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      set({ user, token, loading: false });
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
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
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      return true;
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
      return false;
    }
  }
}));