import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, logout }) => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="nav-logo">
          <h2 style={{ margin: 0 }}>PFCA CapiGrid</h2>
        </div>
        <div className="nav-links">
          <a href="#profile">Profile</a>
          <a href="#toggle-mode">Dark/Light Mode</a>
          <a href="#currency">Currency</a>
          <a href="#contact">Contact</a>
          <a href="#social">Social</a>
          <a href="#about-capi">About CapiGrid</a>
          <a href="#about-pfca">About PFCAfrica</a>
          <a href="https://www.pfcafrica.com" target="_blank" rel="noopener noreferrer">Our Website</a>
        </div>
      </div>

      {/* Arrow Navigation (Placeholder) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)}>&larr; Previous</button>
        <button onClick={() => navigate(1)}>Next &rarr;</button>
      </div>

      <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      {/* Campaigns Section */}
      <section>
        <h2>Available Campaigns</h2>
        {campaigns.length > 0 ? campaigns.map((c, i) => (
          <div key={i} className="campaign-box">{c.title}</div>
        )) : <p>No campaigns available yet</p>}
      </section>

      {/* Investment Section */}
      <section className="invest-section">
        <h2>Invest in PFCA CapiGrid</h2>
        <p>Become part of our journey. Invest now and own equity shares.</p>
        <button onClick={() => navigate('/invest')}>Invest Now</button>
      </section>

      {/* Pre-Registration Section */}
      <section className="pre-register">
        <h2>Pre-Register for the Main Platform</h2>
        <p>Get notified when we launch.</p>
        <button onClick={async () => {
          try {
            await axios.post('https://landing-page-gere.onrender.com/pre-register', { email: user?.email });
            alert('Pre-Registration successful! You will be notified.');
          } catch (err) {
            alert('Pre-Registration failed.');
          }
        }}>Pre-Register</button>
      </section>
    </div>
  );
};

export default Dashboard;
