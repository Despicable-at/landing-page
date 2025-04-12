import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/signup', { name, email, password });
      alert(res.data.message);
      localStorage.setItem('pendingEmail', email);
      navigate('/verify');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  // Image slider setup
  const images = [
    '/images/Campaign-Photoroom.png',
    '/images/Pre-register-Photoroom.png',
    '/images/invest-Photoroom.png'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-wrapper"> 
      <div className="auth-main">
        <div className="auth-image-slider">
          <img src={images[currentImage]} alt="Slider" />
        </div>
  
        <div className="auth-container">
          <h2>Create Account</h2>

          {/* Full Name Input with Floating Label */}
          <div className="input-wrapper">
            <input 
              type="text" 
              id="name"
              placeholder=" " 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className={name ? "filled" : ""}
            />
            <label htmlFor="name" className={name ? "filled" : ""}>Full Name</label>
          </div>

          {/* Email Input with Floating Label */}
          <div className="input-wrapper">
            <input 
              type="email" 
              id="email"
              placeholder=" " 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className={email ? "filled" : ""}
            />
            <label htmlFor="email" className={email ? "filled" : ""}>Email</label>
          </div>

          {/* Password Input with Show/Hide and Floating Label */}
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
                top: password ? "25px" : "50%",  // Moves the label above when the input is filled
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

          <button onClick={handleSignup}>Sign Up</button>

          <p>
            Already have an account? 
            <span onClick={() => navigate('/')} style={{ color: 'blue', cursor: 'pointer' }}> Login</span>
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

export default SignupPage;
