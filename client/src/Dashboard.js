import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { NotificationContext } from './NotificationContext';

const Dashboard = ({ user, logout, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const showNotification = useContext(NotificationContext);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('https://landing-page-gere.onrender.com/my-campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
        showNotification('error', 'Failed to load campaigns');
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>

      <div className="dashboard-grid">
        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/Campaign.jpg)' }}></div>
          <div className="content">
            <h3>Available Campaigns</h3>
            {campaigns.length > 0 ? campaigns.map((c, i) => (
              <div key={i} className="campaign-box">
                <strong>{c.title}</strong>
                <div className="image-placeholder">[Campaign Image]</div>
              </div>
            )) : <p>No campaigns available yet</p>}
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/invest.jpg)' }}></div>
          <div className="content">
            <h3>Invest in PFCA CapiGrid</h3>
            <p>Become part of our journey. Click below to invest now!</p>
            <button onClick={() => navigate('/invest')}>Invest Now</button>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/Pre-register.jpg)' }}></div>
          <div className="content">
            <h3>Pre-Register</h3>
            <p>Get notified when we launch the main platform.</p>
            <button onClick={async () => {
              try {
                await axios.post('https://landing-page-gere.onrender.com/pre-register', { email: user?.email });
                showNotification('success', 'Pre-Registration successful!');
              } catch (err) {
                showNotification('error', 'Pre-Registration failed');
              }
            }}>Pre-Register</button>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/help.jpg)' }}></div>
          <div className="content">
            <h3>Need Help?</h3>
            <p>Contact our support team for help or inquiries.</p>
            <button onClick={() => window.location.href = 'mailto:support@pfcafrica.online'}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
