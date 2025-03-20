import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ user, logout }) => {
  const [campaigns, setCampaigns] = useState([]);

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

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>
      <button className="logout-btn" onClick={logout}>Logout</button>

      <section>
        <h2>Available Campaigns</h2>
        {campaigns.length > 0 ? campaigns.map((c, i) => (
          <div key={i} className="campaign-box">{c.title}</div>
        )) : <p>No campaigns available yet</p>}
      </section>

      <section className="invest-section">
        <h2>Invest in PFCA CapiGrid</h2>
        <p>Be part of our journey. Invest now!</p>
        <button>Invest Now</button>
      </section>

      <section className="pre-register">
        <h2>Pre-Register for the Main Platform</h2>
        <p>Get notified when we launch.</p>
        <button>Pre-Register</button>
      </section>
    </div>
  );
};

export default Dashboard;
