import React, { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [token, setToken] = useState('');

  // Fetch Campaigns
  const fetchCampaigns = async () => {
    const res = await api.get('/campaigns');
    setCampaigns(res.data);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await api.post('/signup', { email, password });
    alert(res.data.message);
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.post('/login', { email: loginEmail, password: loginPass });
    alert(res.data.message);
    setToken(res.data.token);
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>PFCA CapiGrid Frontend</h1>

      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
        <button type="submit">Sign Up</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" /><br />
        <input value={loginPass} type="password" onChange={(e) => setLoginPass(e.target.value)} placeholder="Password" /><br />
        <button type="submit">Login</button>
      </form>

      <h2>Campaigns</h2>
      <button onClick={fetchCampaigns}>Reload Campaigns</button>
      <div>
        {campaigns.length > 0 ? campaigns.map((c, i) => (
          <div key={i} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>Goal: GHS {c.goal} | Raised: GHS {c.raised}</p>
          </div>
        )) : 'No campaigns found'}
      </div>
    </div>
  );
}

export default App;

