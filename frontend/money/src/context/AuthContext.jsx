import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          console.log('Token found, loading user data...');
          const response = await authService.getCurrentUser();
          console.log('User data loaded:', response.data);
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Failed to load user:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
        }
      } else {
        console.log('No token found, user is not logged in');
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authService.login({ username, password });
      console.log('Login response:', response.data);
      
      // The response should have token, username, email, id, and role
      const { token, username: respUsername, email, id } = response.data;
      localStorage.setItem('token', token);
      
      // Set current user with all the data from the response
      setCurrentUser({
        id,
        username: respUsername,
        email,
        role: response.data.role
      });
      
      return response.data;
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.response?.data || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setError(null);
    // This will be caught by our notification system and show a success message
    return { success: true, message: 'Logged out successfully' };
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};