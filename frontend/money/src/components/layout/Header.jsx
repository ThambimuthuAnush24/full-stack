import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    // Close dropdown after logout
    setProfileDropdownOpen(false);
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