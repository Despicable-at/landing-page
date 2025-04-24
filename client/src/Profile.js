import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import { useNotification } from './NotificationContext';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: 'Male',
    birthday: '2001-01-05',
    phone: '+8801759263000',
    newEmail: '',
    emailPassword: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const showNotification = useNotification();

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

      const payload = {
        ...formData,
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
      <h1 className="profile-title">Edit Profile</h1>

      <div className="profile-header">
        <h2 className="profile-name">{formData.name}</h2>
        <p className="profile-username">@{user?.username || 'username'}</p>
      </div>

      <div className="profile-divider"></div>

      <div className="profile-details">
        <div className="detail-group">
          <label>Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="detail-input"
          />
        </div>

        <div className="detail-row">
          <div className="detail-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={formData.gender}
              onChange={handleInputChange}
              className="detail-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="detail-group">
            <label>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="detail-input"
            />
          </div>
        </div>

        <div className="detail-group">
          <label>Phone number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="detail-input"
          />
        </div>

        <div className="detail-group">
          <label>Email</label>
          <input
            type="email"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleInputChange}
            className="detail-input"
          />
        </div>

        <div className="profile-divider"></div>

        <div className="password-section">
          <h3>Change Password</h3>
          <div className="detail-group">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Current Password"
              className="detail-input"
            />
          </div>
          <div className="detail-group">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              className="detail-input"
            />
          </div>
          <div className="detail-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="detail-input"
            />
          </div>
        </div>
      </div>

      <button 
        className="profile-save-button"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default Profile;
