import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaUserCircle } from 'react-icons/fa';
import { ILLUSTRATIONS } from '../../assets/images';
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Show error from context as toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (!formData.password.trim()) {
      toast.error('Password is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    toast.info('Creating your account...', { autoClose: 2000 });
    
    try {
      // Use our authService API
      const result = await register(formData);
      toast.success('Registration successful!');
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        toast.error(`Registration failed: ${error.response.data}`);
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img src={ILLUSTRATIONS.register} alt="Register illustration" className="auth-image" />
      </div>
      <div className="auth-form-container">
        <div className="auth-logo">
          <div className="logo-icon">💰</div>
          <h2>Money Manager</h2>
        </div>
        <h3>Create an Account</h3>
        <p className="auth-subtitle">Sign up to start tracking your finances</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="animated-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-with-icon">
                <FaUserCircle className="auth-input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  className="auth-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-with-icon">
                <FaUserCircle className="auth-input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  className="auth-input"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="auth-input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="auth-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <FaUser className="auth-input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
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
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min. 6 characters)"
                minLength="6"
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
                <span className="button-spinner"></span> Creating Account...
              </>
            ) : (
              <>
                <FaUserPlus /> Create Account
              </>
            )}
          </button>
        </form>
        
        <div className="auth-links">
          <p className="auth-redirect">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
        
        <div className="auth-decoration top-right"></div>
        <div className="auth-decoration bottom-left"></div>
      </div>
    </div>
  );
};

export default Register;