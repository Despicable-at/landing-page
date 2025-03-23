// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
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

  return (
    <div>
      {/* Render Navbar at top */}
      <Navbar user={user} logout={logout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="dashboard-container">
        {/* Optional: Display a profile welcome message */}
        <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>

        {/* Grid for Boxes: Two per row */}
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

          {/* Box 2: Invest in PFCA CapiGrid */}
          <div className="dashboard-box">
            <h3>Invest in PFCA CapiGrid</h3>
            <p>Become part of our journey. Click below to invest now!</p>
            <button onClick={() => navigate('/invest')}>Invest Now</button>
          </div>

          {/* Box 3: Pre-Register & Need Help */}
          <div className="dashboard-box">
            <h3>Pre-Register & Need Help?</h3>
            <button onClick={async () => {
              try {
                await axios.post('https://landing-page-gere.onrender.com/pre-register', { email: user?.email });
                alert('Pre-Registration successful! You will be notified.');
              } catch (err) {
                alert('Pre-Registration failed.');
              }
            }}>Pre-Register</button>
            <button onClick={() => window.location.href = 'mailto:support@pfcafrica.online'}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
