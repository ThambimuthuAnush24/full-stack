import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaSave, FaKey, FaUser, FaEnvelope, FaLock, FaUserEdit, FaShieldAlt } from 'react-icons/fa';
import { ILLUSTRATIONS } from '../../assets/images';
import '../../styles/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await userService.getProfile();
      const userData = response.data;
      
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        username: userData.username || '',
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to load user profile.');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header page-section">
        <div className="header-content">
          <h1>User Profile</h1>
          <p className="subtitle">Manage your account information and security settings</p>
        </div>
        <div className="profile-illustration">
          <img src={ILLUSTRATIONS.profile} alt="Profile illustration" className="illustration-image" />
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUserEdit className="tab-icon" /> Profile Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FaShieldAlt className="tab-icon" /> Security Settings
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-form-container card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <p>Update your personal details</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="profile-form animated-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="styled-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="styled-input"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="styled-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    disabled
                    className="styled-input disabled"
                  />
                </div>
                <span className="help-text">Username cannot be changed</span>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary animated-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="profile-form-container card">
            <div className="card-header">
              <h3>Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="profile-form animated-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="styled-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="styled-input"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="styled-input"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary animated-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span> Changing...
                  </>
                ) : (
                  <>
                    <FaKey /> Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        <div className="profile-tip">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <h4>Security Tip</h4>
            <p>For better security, use a strong password with a mix of letters, numbers, and symbols.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;