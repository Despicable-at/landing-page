import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL hash
    const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      alert("Google login failed or token missing.");
      navigate('/');
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
