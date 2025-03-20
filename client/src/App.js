import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

function App() {
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [campaigns, setCampaigns] = useState([]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://capigrid-backend.onrender.com/signup', {
        email: signupEmail,
        password: signupPassword
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://capigrid-backend.onrender.com/login', {
        email: loginEmail,
        password: loginPassword
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('https://capigrid-backend.onrender.com/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load campaigns');
    }
  };

  return (
    <div className="container">
      <h1>PFCA CapiGrid</h1>

      <form onSubmit={handleSignup} className="card">
        <h2>Signup</h2>
        <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>

      <form onSubmit={handleLogin} className="card">
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      <div className="card campaigns">
        <h2>Campaigns</h2>
        <button onClick={fetchCampaigns}>Reload Campaigns</button>
        {campaigns.length ? (
          campaigns.map((campaign) => <p key={campaign._id}>{campaign.title}</p>)
        ) : (
          <p>No campaigns found</p>
        )}
      </div>

      <footer>© 2024 PFCA CapiGrid. All rights reserved.</footer>
    </div>
  );
}

export default App;
