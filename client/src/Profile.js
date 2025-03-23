// Profile.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const navigate = useNavigate();

  const handleUpdate = async () => {
    // Implement API call to update user info on the backend
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/update-profile', {
        userId: user._id,
        name,
        email,
        password, // if provided
        profilePic
      });
      setUser(res.data.user);
      alert('Profile updated successfully.');
    } catch (err) {
      alert('Update failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Profile Settings</h2>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
      
      <div>
        <label>Update Profile Picture:</label>
        <input type="file" accept="image/*" onChange={(e) => {
          // Implement upload logic (e.g., Cloudinary)
        }} />
        {profilePic && <img src={profilePic} alt="Profile" style={{ width: '100px', borderRadius: '50%' }} />}
      </div>

      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '10px' }}>Back to Dashboard</button>
    </div>
  );
};

export default Profile;
