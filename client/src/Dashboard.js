import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, logout }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();  // Calls the prop logout to clear App.js state
  };

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

  // 🔥 Handle Investment (Optional direct DB test)
  const handleInvest = async () => {
    try {
      await axios.post('https://capigrid-backend.onrender.com/invest', {
        userId: user?._id,
        amount: 5000  // You can make this dynamic or remove this if using the InvestPage
      });
      alert('Thank you for investing! We will contact you.');
    } catch (err) {
      alert('Investment failed. Try again.');
    }
  };

  // 🔥 Pre-Register Function
  const handlePreRegister = async () => {
    try {
      await axios.post('https://capigrid-backend.onrender.com/pre-register', {
        email: user?.email
      });
      alert('Pre-Registration successful! You will be notified.');
    } catch (err) {
      alert('Pre-Registration failed.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || 'CapiGrid User'}</h1>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      {/* 🔥 Campaigns */}
      <section>
        <h2>Available Campaigns</h2>
        {campaigns.length > 0 ? campaigns.map((c, i) => (
          <div key={i} className="campaign-box">{c.title}</div>
        )) : <p>No campaigns available yet</p>}
      </section>

      {/* 🔥 Investment Section */}
      <section className="invest-section">
        <h2>Invest in PFCA CapiGrid</h2>
        <p>Become part of our journey. Invest now and own equity shares.</p>
        <button onClick={() => navigate('/invest')}>Invest Now</button>
      </section>

      {/* 🔥 Pre-Register Section */}
      <section className="pre-register">
        <h2>Pre-Register for the Main Platform</h2>
        <p>Get notified when we launch.</p>
        <button onClick={handlePreRegister}>Pre-Register</button>
      </section>
    </div>
  );
};

export default Dashboard;
