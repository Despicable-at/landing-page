import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import './style.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-container">
      <h2>Welcome to PFCA CapiGrid</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => onLogin(email, password)}>Login / Signup</button>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get('https://capigrid-backend.onrender.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchUserData(token);
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post('https://capigrid-backend.onrender.com/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        fetchUserData(res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard user={user} logout={logout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
