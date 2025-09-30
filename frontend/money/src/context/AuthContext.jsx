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
          // First try decoding the token to get basic user info
          // This helps us immediately establish authentication even if the API call fails
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            console.log('JWT payload:', payload);
            
            // Set basic user info from token
            if (payload.sub) {
              setCurrentUser({
                username: payload.sub,
                // Other fields will be filled from API response
              });
            }
          } catch (jwtError) {
            console.error('Error parsing JWT token:', jwtError);
          }
          
          // Then get full user details from API
          const response = await authService.getCurrentUser();
          console.log('User data loaded from API:', response.data);
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
      
      // Extract data from response
      const { token, id, username: respUsername, email, role } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set current user with all the data from the response
      setCurrentUser({
        id,
        username: respUsername,
        email,
        role
      });
      
      console.log('User authenticated successfully:', respUsername);
      return response.data;
    } catch (err) {
      console.error('Login error details:', err);
      
      // More detailed error handling
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid username or password');
        } else {
          setError(err.response.data || 'Login failed');
        }
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
      
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