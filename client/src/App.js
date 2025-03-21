import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupPage from './SignupPage';
import VerifyEmail from './VerifyEmail';
import Dashboard from './Dashboard';
import OAuthCallback from './OAuthCallback';
import './style.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get('https://https://landing-page-gere.onrender.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <LoginForm setToken={setToken} setUser={setUser} />
        } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={token ? <Dashboard user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const LoginForm = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/OAuthCallback', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // Google OAuth flow trigger (you will replace backend endpoint with your actual OAuth logic)
  const handleGoogleLogin = () => {
    window.location.href = 'https://landing-page-gere.onrender.com/auth/google';
  };

  return (
    <div className="auth-container">
      <h2>Welcome to PFCA CapiGrid</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      {/* Google Sign In */}
      <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', marginTop: '15px' }}>
        Sign in with Google
      </button>

      <p>Don’t have an account? <span style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/signup')}>Create one</span></p>
    </div>
  );
};

export default App;
