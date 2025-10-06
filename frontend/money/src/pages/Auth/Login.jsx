import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import '../../styles/Auth.css';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { ILLUSTRATIONS } from '../../assets/images';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  // Check for messages from other components (like registration success)
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clean up the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Show error from context as toast and update local error state
  useEffect(() => {
    if (error) {
      toast.error(error);
      setLoginError(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Validate input
      if (!credentials.username.trim() || !credentials.password.trim()) {
        toast.error('Username and password are required');
        setIsLoading(false);
        return;
      }
      
      console.log('Attempting login with:', credentials.username);
      
      // Try using fetch directly for the most reliable approach
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          })
        });
        
        // Get response text first
        const responseText = await response.text();
        console.log('Login response text:', responseText);
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Parsed login response:', data);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          data = { message: responseText };
        }
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP error ${response.status}`);
        }
        
        // Handle successful login
        if (data.token) {
          localStorage.setItem('token', data.token);
          
          // Store user data
          const user = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role
          };
          
          // Store in session to persist user data
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          throw new Error('Response missing token');
        }
      } catch (fetchError) {
        console.error('Fetch login failed:', fetchError);
        
        // Fall back to context login
        try {
          await login(credentials.username, credentials.password);
          toast.success('Login successful!');
          navigate('/dashboard');
        } catch (contextError) {
          console.error('Context login also failed:', contextError);
          throw contextError;
        }
      }
    } catch (error) {
      console.error('All login attempts failed:', error);
      
      // Show detailed error message
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
        setLoginError(`Login failed: ${errorMessage}`);
        toast.error(`Login failed: ${errorMessage}`);
      } else {
        setLoginError(error.message || 'Login failed');
        toast.error(error.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img src={ILLUSTRATIONS.login} alt="Login illustration" className="auth-image" />
      </div>
      <div className="auth-form-container">
        <div className="auth-logo">
          <div className="logo-icon">💰</div>
          <h2>Money Manager</h2>
        </div>
        <h3>Welcome Back!</h3>
        <p className="auth-subtitle">Sign in to continue managing your finances</p>
        
        {(error || loginError) && <div className="error-message">{error || loginError}</div>}
        
        <form onSubmit={handleSubmit} className="animated-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FaUser className="auth-input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="auth-input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="auth-input"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-primary auth-button animated-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span> Signing in...
              </>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="auth-links">
          <p className="auth-redirect">
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </p>
          
          <div className="auth-help-link">
            <Link to="/api-test" className="help-link">
              Having trouble logging in? Try our API test page
            </Link>
          </div>
        </div>
        
        <div className="auth-decoration top-right"></div>
        <div className="auth-decoration bottom-left"></div>
      </div>
    </div>
  );
};

export default Login;