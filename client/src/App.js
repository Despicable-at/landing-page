import React, { useState, useEffect, useContext } from 'react';
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
import { NotificationProvider, useNotification } from './NotificationContext';

// 1. LoadingScreen component
const LoadingScreen = () => (
  <div className="loading-screen">
    <img src="/capigrid.png" alt="PFCA Logo" className="loading-logo" />
    <p className="loading-text">Powered by PFCA</p>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const showNotification = useNotification();
  const [loadingScreen, setLoadingScreen] = useState(false);

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

  const GlobalDarkModeToggle = ({ darkMode, toggleDarkMode }) => (
    <button 
      className={`dark-mode-toggle-btn ${darkMode ? 'dark' : ''}`}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    showNotification('success', `Switched to ${newMode ? 'dark' : 'light'} mode`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    showNotification('info', 'You have been logged out');
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  if (loadingScreen) {
    return <LoadingScreen />;
  }


  return (
    <NotificationProvider>
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
          token
            ? <Navigate to="/dashboard" />
            : <AuthForm
                isLogin={true}
                setToken={setToken}
                setUser={setUser}
                darkMode={darkMode}
                setLoadingScreen={setLoadingScreen}    // pass setter
              />
        }/>
        <Route path="/signup" element={
          <AuthForm
            isLogin={false}
            setToken={setToken}
            setUser={setUser}
            darkMode={darkMode}
            setLoadingScreen={setLoadingScreen}
          />
        }/>
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={
          token
            ? <Dashboard
                user={user}
                logout={handleLogout}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                setLoadingScreen={setLoadingScreen}  // pass setter
              />
            : <Navigate to="/" />
        }/>
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/invest" element={<InvestPage user={user} />} />
        <Route path="/invest-payment" element={<InvestPayment user={user} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
      </Routes>
      <GlobalDarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </NotificationProvider>
  );
};

const AuthForm = ({ isLogin, setToken, setUser, darkMode, setLoadingScreen }) => {
  const showNotification = useNotification();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSwitching, setIsSwitching] = useState(!isLogin);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post('https://landing-page-gere.onrender.com/login', formData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showNotification('success', 'Login successful!');
        // 5. Turn on loader just before navigating to Dashboard
        setLoadingScreen(true);
        navigate('/dashboard');
      } else {
        const res = await axios.post('https://landing-page-gere.onrender.com/signup', formData);
        showNotification('success', res.data.message);
        localStorage.setItem('pendingEmail', formData.email);
        navigate('/verify');
      }
    } catch (err) {
      if (isLogin && err.response?.status === 403 && err.response?.data?.status === 'unverified') {
        showNotification('warning', 'Please verify your email first');
        localStorage.setItem('pendingEmail', formData.email);
        navigate('/verify');
      } else {
        const msg = err.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed');
        showNotification('error', msg);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://landing-page-gere.onrender.com/auth/google';
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-main">
        <div className={`auth-image-slider ${isLogin ? 'login-panel' : 'signup-panel'} ${isSwitching ? 'switch' : ''} ${darkMode ? 'dark-mode' : ''}`}>
          <div className="slider-content">
            <h2>{isLogin ? 'Welcome Back!' : 'Hello, Friend!'}</h2>
            <p>
              {isLogin 
                ? 'To keep connected with us please login with your personal info'
                : 'Enter your personal details and start journey with us'}
            </p>
            <button 
              className="slider-button"
              onClick={() => {
                setIsSwitching(!isSwitching);
                setTimeout(() => navigate(isLogin ? '/signup' : '/'), 600);
              }}
            >
              {isLogin ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>
        </div>

        <div className={`auth-container ${isSwitching ? 'switch' : ''}`}>
          <h2>{isLogin ? 'Sign in to CapiGrid' : 'Create Account'}</h2>
          
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
            <span 
              onClick={() => {
                setIsSwitching(!isSwitching);
                setTimeout(() => navigate(isLogin ? '/signup' : '/'), 600);
              }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

const Footer = ({ darkMode }) => {
  const showNotification = useNotification();
  const [showLanguages, setShowLanguages] = useState(false);
  const toggleLanguages = () => setShowLanguages(!showLanguages);
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic'];

  return (
    <footer className={`footer ${darkMode ? 'dark-mode' : ''}`}>
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
                    showNotification('info', `Translate to ${lang}`);
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
