// OAuthCallback.js - Updated Code
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext'; // Add this import

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification(); // Add this hook

  useEffect(() => {
    // Parse the fragment instead of query parameters
    const fragmentParams = new URLSearchParams(location.hash.substring(1));
    const token = fragmentParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard'); // Force redirect to dashboard
    } else {
      showNotification('error', "Google login failed");
      navigate('/');
    }
  }, [navigate, location, showNotification]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
