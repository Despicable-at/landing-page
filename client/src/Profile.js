import React, { useState, useContext } from 'react';
import axios from 'axios';
import './style.css';
import { NotificationContext } from '../context/NotificationContext';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png');
  const [imageFile, setImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showNotification = useContext(NotificationContext);

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'your_preset');
      const res = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData);
      return res.data.secure_url;
    } catch (err) {
      showNotification('error', 'Image upload failed');
      return profilePic;
    }
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      showNotification('error', 'Passwords do not match');
      return;
    }

    try {
      let newProfilePic = profilePic;
      if (imageFile) newProfilePic = await handleImageUpload();

      const res = await axios.put('https://landing-page-gere.onrender.com/update-profile', {
        name,
        profilePic: newProfilePic,
        currentPassword,
        newPassword,
        email: newEmail,
        emailPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      showNotification('success', 'Profile updated successfully');
      
      if (newEmail) {
        showNotification('info', 'Please verify your new email');
        localStorage.removeItem('token');
        window.location.href = '/verify';
      } else {
        setUser(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      showNotification('error', msg);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Profile Settings</h2>

      {/* Change Profile Picture */}
            <div className="profile-section">
        <h3>Change Profile Picture</h3>
        <div className="profile-pic-wrapper">
          <img src={profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Profile" />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
      </div>


      {/* ✅ Change Display Name */}
      <h3>Change Display Name</h3>
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />

      {/* ✅ Change Email */}
      <h3>Change Email</h3>
      <input
        type="email"
        placeholder="New Email (if changing)"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      {newEmail && (
        <input
          type="password"
          placeholder="Enter Password to Confirm Email Change"
          value={emailPassword}
          onChange={(e) => setEmailPassword(e.target.value)}
        />
      )}

      {/* ✅ Change Password */}
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default Profile;
