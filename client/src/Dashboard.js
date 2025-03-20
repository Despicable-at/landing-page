import React, { useState, useEffect } from 'react';
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
        console.error('Failed to fetch campaigns');
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.name || 'CapiGrid User'}</h1>
      <button className="logout-btn" onClick={logout}>Logout</button>

      <section>
        <h2>Your Campaigns</h2>
        {campaigns.length > 0 ? campaigns.map((c, index) => (
          <div key={index} className="campaign-box">{c.title}</div>
        )) : <p>No campaigns yet</p>}
      </section>

      <section className="invest-section">
        <h2>Invest in PFCA CapiGrid</h2>
        <p>Join us in building the future. Invest now.</p>
        <button>Invest Now</button>
      </section>

      <section className="pre-register">
        <h2>Pre-Register for Main Platform</h2>
        <p>Get early access when we launch!</p>
        <button>Pre-Register</button>
      </section>
    </div>
  );
};

export default Dashboard;

