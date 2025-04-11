import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupPage from './SignupPage';
import VerifyEmail from './VerifyEmail';
import Dashboard from './Dashboard';
import OAuthCallback from './OAuthCallback';
import InvestPage from './InvestPage';
import InvestPayment from './InvestPayment';
import ThankYou from './ThankYou';
import Profile from './Profile';
import './style.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchUserData(token);
    document.body.className = darkMode ? 'dark' : '';
  }, [token, darkMode]);

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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.className = newMode ? 'dark' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // Close hamburger after navigating
  };

  return (
    <>
      {token && (
        <div className="navbar">
          <div className="brand"><strong>PFCA CapiGrid</strong></div>

          <div className="desktop-nav-links">
            <a onClick={() => handleNavigate('/dashboard')}>Dashboard</a>
            <a onClick={() => handleNavigate('/invest')}>Invest</a>
            <a onClick={() => handleNavigate('/profile')}>Profile</a>
            <a onClick={toggleDarkMode}>{darkMode ? '☀ Light' : '🌙 Dark'}</a>
            <a href="https://pfcafrica.online" target="_blank" rel="noreferrer">About PFCAfrica</a>
            <a onClick={handleLogout}>Logout</a>
          </div>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>

          <div className={`mobile-nav-links ${menuOpen ? 'mobile-nav-active' : ''}`}>
            <a onClick={() => handleNavigate('/dashboard')}>Dashboard</a>
            <a onClick={() => handleNavigate('/invest')}>Invest</a>
            <a onClick={() => handleNavigate('/profile')}>Profile</a>
            <a onClick={toggleDarkMode}>{darkMode ? '☀ Light' : '🌙 Dark'}</a>
            <a href="https://pfcafrica.online" target="_blank" rel="noreferrer">About PFCAfrica</a>
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <LoginForm setToken={setToken} setUser={setUser} />
        } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={
          token
            ? <Dashboard user={user} logout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            : <Navigate to="/" />
        } />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/invest" element={<InvestPage user={user} />} />
        <Route path="/invest-payment" element={<InvestPayment user={user} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
      </Routes>
    </>
  );
};

const LoginForm = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Image slider setup
  const images = [
    '/images/Campaign.jpg', 
    '/images/Pre-register.jpg',
    '/images/invest.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.status === 'unverified') {
        localStorage.setItem('pendingEmail', email);
        navigate('/verify');
      } else {
        alert(err.response?.data?.message || 'Login failed');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://landing-page-gere.onrender.com/auth/google';
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-main">
        <div className="auth-image-slider">
          <img src={images[currentImage]} alt="Slider" />
        </div>

        <div className="auth-container">
          <h2>Welcome to PFCA CapiGrid</h2>
          
          {/* Email Input with Floating Label */}
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={email ? "filled" : ""}
            />
            <label htmlFor="email" className={email ? "filled" : ""}>Email</label>
          </div>

          <div className="password-container" style={{ position: "relative", width: "100%" }}>
            {/* Password Input */}
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              placeholder=" "  // Use a space for placeholder to prevent label overlap
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{
                width: "100%",
                paddingRight: "50px", // Adds space for the text inside
                paddingLeft: "10px",  // Adjust padding for the label
                paddingTop: "12px",   // Align the text with the label
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "none",
              }} 
            />
            
            {/* Show/Hide Password */}
            {password && (
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{
                  position: "absolute", 
                  right: "10px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#aaa"
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            )}
            
            {/* Floating Label */}
            <label 
              htmlFor="password" 
              style={{
                position: "absolute", 
                left: "10px", 
                top: password ? "-5px" : "30%",  // Moves the label above when the input is filled
                fontSize: password ? "12px" : "16px",  // Shrinks the font when the label is moved above
                color: password ? "#007bff" : "#aaa", // Color change on focus
                transition: "0.3s ease all",
                pointerEvents: "none",
                transform: "translateY(-50%)",
              }}
            >
              Password
            </label>
          </div>


          <button onClick={handleLogin}>Login</button>

          <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', marginTop: '15px' }}>
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" style={{ marginRight: '8px' }} />
            Sign in with Google
          </button>

          <p>Don’t have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Create one</span></p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Footer = () => {
  const [showLanguages, setShowLanguages] = useState(false);
  const toggleLanguages = () => {
    setShowLanguages(!showLanguages);
  };

  // List of additional languages (for demonstration; you can extend this list)
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'];

  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">PFCAfrica</a>
        <a href="#">Contact Us</a>
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
        <a href="#">Youtube</a>
        <a href="#">Twitter</a>
        <a href="#">Terms</a>
        <a href="#">About</a>
        <div className="language-dropdown">
          <button onClick={toggleLanguages}>
            English <span>&#x25B2;</span>
          </button>
          {showLanguages && (
            <div className="dropdown-menu">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className="dropdown-item"
                  onClick={() => {
                    alert(`Translate to ${lang}`);
                    setShowLanguages(false);
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} PFCAfrica. All rights reserved.
      </div>
    </footer>
  );
};

export default App;
