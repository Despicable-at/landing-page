import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    setMenuOpen(false);
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
          token ? <Navigate to="/dashboard" /> : <AuthForm isLogin={true} setToken={setToken} setUser={setUser} />
        } />
        <Route path="/signup" element={<AuthForm isLogin={false} setToken={setToken} setUser={setUser} />} />
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

const AuthForm = ({ isLogin, setToken, setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const navigate = useNavigate();

    // Update handle navigation
  const handleSwitch = () => {
    setIsSwitching(true);
    setTimeout(() => {
      navigate(isLogin ? '/signup' : '/');
      setIsSwitching(false);
    }, 600);
  };


  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post('https://landing-page-gere.onrender.com/login', formData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        navigate('/dashboard');
      } else {
        const res = await axios.post('https://landing-page-gere.onrender.com/signup', formData);
        alert(res.data.message);
        localStorage.setItem('pendingEmail', formData.email);
        navigate('/verify');
      }
    } catch (err) {
      if (isLogin && err.response?.status === 403 && err.response?.data?.status === 'unverified') {
        localStorage.setItem('pendingEmail', formData.email);
        navigate('/verify');
      } else {
        alert(err.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed'));
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://landing-page-gere.onrender.com/auth/google';
  };

  const AuthForm = ({ isLogin, setToken, setUser }) => {
  // ... other state
  const [isSwitching, setIsSwitching] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-main">
        {/* Desktop Image Slider */}
        <div className={`auth-image-slider ${isLogin ? 'login-panel' : 'signup-panel'} ${isSwitching ? 'switch' : ''}`}>
          <div className="slider-content">
            <h2>{isLogin ? 'Welcome Back!' : 'Hello, Friend!'}</h2>
            <p>
              {isLogin 
                ? 'To keep connected with us please login with your personal info'
                : 'Enter your personal details and start journey with us'}
            </p>
            <button 
              className="slider-button"
              onClick={handleSwitch}
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className={`auth-container ${isSwitching ? 'switch' : ''}`}>
          <h2>{isLogin ? 'Sign in to CapiGrid' : 'Create Account'}</h2>
          
          {/* Mobile Header */}
          <div className="mobile-auth-header">
            <h2>{isLogin ? 'CapiGrid' : 'Create Account'}</h2>
          </div>
          
          <div className="auth-fields">
            {!isLogin && (
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder=" "
                />
                <label htmlFor="name">Full Name</label>
              </div>
            )}

            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
                placeholder=" "
              />
              <label htmlFor="password">Password</label>
              {formData.password && (
                <span 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              )}
            </div>

            <button className="auth-button" onClick={handleSubmit}>
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>

            {isLogin && (
              <>
                <div className="divider">
                  <span>OR</span>
                </div>
                
                <button className="google-button" onClick={handleGoogleLogin}>
                  <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
                  Continue with Google
                </button>
              </>
            )}
          </div>


          <p className="auth-switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span onClick={handleSwitch}>
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </p>
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
