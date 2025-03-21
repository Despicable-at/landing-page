import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupPage from './SignupPage';
import VerifyEmail from './VerifyEmail';
import Dashboard from './Dashboard';
import OAuthCallback from './OAuthCallback';
import InvestPage from './InvestPage';
import InvestPayment from './InvestPayment';
import './style.css';
import ThankYou from './ThankYou';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("App Loaded ✅");
    if (token) fetchUserData(token);
  }, [token]);

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get('https://landing-page-gere.onrender.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        token ? <Navigate to="/dashboard" /> : <LoginForm setToken={setToken} setUser={setUser} />
      } />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route 
        path="/dashboard" 
        element={
          localStorage.getItem('token') 
            ? <Dashboard user={user} logout={() => {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                window.location.href = '/';
              }} /> 
            : <Navigate to="/" />
        } 
      />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/invest" element={<InvestPage user={user} />} />
      <Route path="/invest-payment" element={<InvestPayment user={user} />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
};

const LoginForm = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // ✅ FIXED - ADDED useNavigate import

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/login', { email, password });  // ✅ FIXED ENDPOINT
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://landing-page-gere.onrender.com/auth/google';
  };

  return (
    <div className="auth-container">
      <h2>Welcome to PFCA CapiGrid</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>

      <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', marginTop: '15px' }}>
        Sign in with Google
      </button>

      <p>Don’t have an account? <span style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/signup')}>Create one</span></p>
    </div>
  );
};

export default App;
