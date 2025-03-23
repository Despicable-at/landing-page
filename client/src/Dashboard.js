import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Dashboard = ({ user, logout, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('https://landing-page-gere.onrender.com/my-campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
      }
    };
    fetchCampaigns();
  }, []);

  const handlePreRegister = async () => {
    try {
      await axios.post('https://landing-page-gere.onrender.com/pre-register', { email: user?.email });
      alert('Pre-Registration successful! You will be notified.');
    } catch (err) {
      alert('Pre-Registration failed.');
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>

        {/* ✅ Dashboard Grid Layout */}
        <div className="dashboard-grid">
          {/* Box 1: Available Campaigns */}
          <div className="dashboard-box">
            <h3>Available Campaigns</h3>
            {campaigns.length > 0 ? campaigns.map((c, i) => (
              <div key={i} className="campaign-box">
                <strong>{c.title}</strong>
                <div className="image-placeholder">[Campaign Image]</div>
              </div>
            )) : <p>No campaigns available yet</p>}
          </div>

          {/* Box 2: Invest */}
          <div className="dashboard-box">
            <h3>Invest in PFCA CapiGrid</h3>
            <p>Become part of our journey. Click below to invest now!</p>
            <button onClick={() => navigate('/invest')}>Invest Now</button>
          </div>

          {/* Box 3: Pre-Register */}
          <div className="dashboard-box">
            <h3>Pre-Register for Launch</h3>
            <p>Get notified when we launch our main platform.</p>
            <button onClick={handlePreRegister}>Pre-Register</button>
          </div>

          {/* Box 4: Need Help */}
          <div className="dashboard-box">
            <h3>Need Help?</h3>
            <p>Our support team is ready to assist you.</p>
            <button onClick={() => window.location.href = 'mailto:support@pfcafrica.online'}>Contact Support</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
