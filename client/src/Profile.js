import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import { useNotification } from './NotificationContext';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    newEmail: '',
    emailPassword: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const showNotification = useNotification();

  const handleImageUpload = async () => {
    if (!imageFile) return profilePic;
    
    try {
      if (imageFile.size > 2 * 1024 * 1024) {
        showNotification('error', 'Image size must be less than 2MB');
        return profilePic;
      }

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      return res.data.secure_url;
    } catch (err) {
      showNotification('error', 'Failed to upload image');
      return profilePic;
    }
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showNotification('error', 'New passwords do not match');
      return false;
    }
    
    if (formData.newEmail && !formData.emailPassword) {
      showNotification('error', 'Please enter password to change email');
      return false;
    }

    if (formData.newPassword && !formData.currentPassword) {
      showNotification('error', 'Please enter current password to change password');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Session expired - please login again');
        window.location.href = '/login';
        return;
      }

      const newProfilePic = await handleImageUpload();
      
      const payload = {
        ...formData,
        profilePic: newProfilePic,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      };

      const res = await axios.put(
        'https://landing-page-gere.onrender.com/update-profile',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (formData.newEmail) {
        showNotification('warning', 'Verification email sent to new address');
        sessionStorage.setItem('pendingEmail', formData.newEmail);
        window.location.href = '/verify';
        return;
      }

      setUser(res.data.user);
      showNotification('success', 'Profile updated successfully');
      setShowConfirmation(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      showNotification('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-container">
      <h2>Profile Settings</h2>

      <div className="profile-section">
        <h3>Account Information</h3>
        <div className="form-group">
          <div className="input-wrapper">
            <label>Display Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Change Email</h3>
          <div className="form-group">
            <div className="input-wrapper">
              <label>New Email</label>
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleInputChange}
                placeholder=" "
              />
              {formData.newEmail && (
                  <label>Enter Password</label>
                <input
                  type="password"
                  name="emailPassword"
                  value={formData.emailPassword}
                  onChange={handleInputChange}
                  placeholder=" "
                />
              )}
            </div>
          </div>
        </div>

      <div className="profile-section">
        <h3>Change Password</h3>
        <div className="form-group">
          <div className="input-wrapper">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          className="cancel-button"
          onClick={() => setShowConfirmation(false)}
        >
          Cancel
        </button>
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          {/* Modal content */}
        </div>
      )}
    </div>
  );
};

export default Profile;
