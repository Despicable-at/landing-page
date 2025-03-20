import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import './style.css';

// ✅ Login Page Component
const LoginPage = ({ setToken, fetchUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
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

  return (
    <div className="auth-container">
      <h2>Welcome to PFCA CapiGrid</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login / Signup</button>
    </div>
  );
};

// ✅ Main App Component
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const fetchUserData = async (userToken) => {
    try {
      const res = await axios.get('https://capigrid-backend.onrender.com/user', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchUserData(token);
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            token 
              ? <Navigate to="/dashboard" /> 
              : <LoginPage setToken={setToken} fetchUserData={fetchUserData} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            token 
              ? <Dashboard user={user} logout={logout} /> 
              : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
