import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [imageFile, setImageFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user?.googleSignIn && !user?.hasPassword) {
      alert('Since you signed in with Google, please create a password for future logins.');
    }
  }, [user]);

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'your_preset'); // ✅ Replace with your Cloudinary preset
    const res = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData); // ✅ Replace cloud name
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
        email,
        currentPassword,
        newPassword,
        profilePic: newProfilePic,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Profile updated successfully');
      setUser(res.data);  // ✅ Update the parent state with latest user data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Profile Settings</h2>

      <div className="profile-section">
        <img src={profilePic || 'https://via.placeholder.com/150'} alt="Profile" />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

      {/* ✅ Password Change Section */}
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
