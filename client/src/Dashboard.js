import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useNotification } from './NotificationContext';

const Dashboard = ({ user, logout, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const showNotification = useNotification();

useEffect(() => {
  const token = localStorage.getItem('token');

  // If no token, just skip fetching campaigns
  if (!token) return;

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('https://landing-page-gere.onrender.com/my-campaigns', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        // Removed navigate('/login')
      }
    }
  };

  fetchCampaigns();
}, []);


  fetchCampaigns();
}, [navigate]); // Only navigate dependency

  // Check both token and user existence
  const token = localStorage.getItem('token');
  if (!token || !user) {
    navigate('/login');
    return;
  }

  fetchCampaigns();
}, [user, navigate, logout]); // Removed showNotification from dependencies

const handlePreRegister = async () => {
  try {
    await axios.post('https://landing-page-gere.onrender.com/pre-register', { 
      email: user?.email 
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    showNotification('success', 'Pre-Registration successful!');
  } catch (err) {
    // Keep pre-registration error notification
    showNotification('error', err.response?.data?.message || 'Pre-Registration failed');
  }
};

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>

      <div className="dashboard-grid">
        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/Campaign.jpg)' }}></div>
          <div className="content">
            <h3>Available Campaigns</h3>
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div key={campaign._id} className="campaign-box">
                  <strong>{campaign.title}</strong>
                  {campaign.imageUrl ? (
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.title} 
                      className="campaign-image"
                    />
                  ) : (
                    <div className="image-placeholder">[Campaign Image]</div>
                  )}
                </div>
              ))
            ) : (
              <p>No campaigns available yet</p>
            )}
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/invest.jpg)' }}></div>
          <div className="content">
            <h3>Invest in PFCA CapiGrid</h3>
            <p>Become part of our journey. Click below to invest now!</p>
            <button 
              onClick={() => navigate('/invest')}
              aria-label="Navigate to investment page"
            >
              Invest Now
            </button>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/Pre-register.jpg)' }}></div>
          <div className="content">
            <h3>Pre-Register</h3>
            <p>Get notified when we launch the main platform.</p>
            <button 
              onClick={handlePreRegister}
              aria-label="Pre-register for main platform"
              disabled={!user?.email}
            >
              Pre-Register
            </button>
          </div>
        </div>

        <div className="dashboard-box">
          <div className="bg-image" style={{ backgroundImage: 'url(/images/help.jpg)' }}></div>
          <div className="content">
            <h3>Need Help?</h3>
            <p>Contact our support team for help or inquiries.</p>
            <button 
              onClick={() => window.location.href = 'mailto:support@pfcafrica.online'}
              aria-label="Contact support via email"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
