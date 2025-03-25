import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png');
  const [imageFile, setImageFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_preset'); // ✅ Replace with your Cloudinary preset
    const res = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData);
    return res.data.secure_url;
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    let newProfilePic = profilePic;
    if (imageFile) newProfilePic = await handleImageUpload();

    try {
      const res = await axios.put('https://landing-page-gere.onrender.com/update-profile', {
        name,
        profilePic: newProfilePic,
        currentPassword,
        newPassword,
        email: newEmail,         // ✅ Only sent if user enters new email
        emailPassword           // ✅ Password required if changing email
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Profile updated successfully');

      // ✅ If email changed, log out user for re-verification
      if (newEmail) {
        alert('Email changed! Please verify your new email.');
        localStorage.removeItem('token');
        window.location.href = '/verify';
      } else {
        setUser(res.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Profile Settings</h2>

      {/* ✅ Change Profile Picture */}
      <h3>Change Profile Picture</h3>
      <div className="profile-section">
        <img src={profilePic} alt="Profile" />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
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
