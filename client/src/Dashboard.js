import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, logout }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('https://capigrid-backend.onrender.com/my-campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
      }
    };
    fetchCampaigns();
  }, []);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(URL.createObjectURL(file));

    // Example upload to Cloudinary (replace 'your-cloudinary-url' with your actual)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'capigrid');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', formData);
      setProfilePic(res.data.secure_url);
      // Optionally: save to DB
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="dashboard-container">

      {/* Navigation Arrows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={() => navigate(1)}>Next →</button>
      </div>

      {/* Profile Section */}
      <section className="profile-section" style={{ textAlign: 'center' }}>
        <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>
        <div>
          <img 
            src={selectedImage || profilePic || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            style={{ width: '150px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <input type="file" accept="image/*" onChange={handleProfilePicUpload} />
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </section>

      {/* Campaigns Section with Placeholder */}
      <section>
        <h2>Available Campaigns</h2>
        {campaigns.length > 0 ? campaigns.map((c, i) => (
          <div key={i} className="campaign-box">
            <strong>{c.title}</strong>
            {/* Placeholder for Campaign Image */}
            <div className="image-placeholder">Upload Campaign Image</div>
          </div>
        )) : (
          <p>No campaigns available yet</p>
        )}
      </section>

      {/* Investment Section */}
      <section className="invest-section">
        <h2>Invest in PFCA CapiGrid</h2>
        <p>Become part of our journey. Invest now and own equity shares.</p>
        <button onClick={() => navigate('/invest')}>Invest Now</button>
      </section>

      {/* Pre-Register */}
      <section className="pre-register">
        <h2>Pre-Register for the Main Platform</h2>
        <p>Get notified when we launch.</p>
        <button onClick={async () => {
          try {
            await axios.post('https://capigrid-backend.onrender.com/pre-register', { email: user?.email });
            alert('Pre-Registration successful! You will be notified.');
          } catch {
            alert('Pre-Registration failed.');
          }
        }}>Pre-Register</button>
      </section>

      {/* Support / Contact */}
      <section className="support-section">
        <h2>Need Help?</h2>
        <button onClick={() => window.location.href = 'mailto:support@pfcafrica.online'}>Contact Support</button>
      </section>

    </div>
  );
};

export default Dashboard;
