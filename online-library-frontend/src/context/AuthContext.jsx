import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async (token) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      toast.error('Session expired. Please login again.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await getCurrentUser(res.data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      await getCurrentUser(res.data.token);
      toast.success('Registered successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {}
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
      throw err;
    }
  };

  const resetPassword = async (data) => {
    try {
      await api.post('/auth/reset-password', data);
      toast.success('Password reset successful. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
      throw err;
    }
  };

  const changePassword = async (data) => {
    try {
      await api.post('/auth/change-password', data);
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
      throw err;
    }
  };

  const refreshToken = async (refreshToken) => {
    try {
      const res = await api.post('/auth/refresh', { refreshToken });
      localStorage.setItem('token', res.data.token);
      await getCurrentUser(res.data.token);
      toast.success('Token refreshed');
    } catch (err) {
      toast.error('Failed to refresh token');
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, changePassword, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;