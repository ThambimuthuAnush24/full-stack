import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    try {
      const result = logout();
      console.log('Logout result:', result);
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Close dropdown after logout
      setProfileDropdownOpen(false);
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <header className="app-header">
      <div className="header-title">
        <h2>Money Manager</h2>
      </div>
      
      <div className="header-actions">
        <div className="user-profile" onClick={toggleProfileDropdown}>
          <FaUserCircle className="user-icon" />
          <span className="username">
            {currentUser?.firstName} {currentUser?.lastName}
          </span>
          
          {profileDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">
                <FaCog /> Profile Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item logout-button"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;