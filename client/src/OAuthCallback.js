import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = ({ setLoadingScreen }) => {  // Add setLoadingScreen prop
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

useEffect(() => {
  setLoadingScreen(true);
  
  const hashParams = new URLSearchParams(location.hash.split("?")[1]);
  const token = hashParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event('storage')); // Force storage event
  } else {
    // Error handling
  }
}, []);

    const hashParams = new URLSearchParams(location.hash.split("?")[1]);
    const queryParams = new URLSearchParams(location.search);
    const token = hashParams.get('token') || queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Let App.js handle the navigation after loading
    } else {
      setLoadingScreen(false); // Turn off loading if error
      const error = hashParams.get('error') || queryParams.get('error');
      showNotification('error', `Google login failed: ${error || 'No token received'}`);
      navigate('/');
    }
  }, [navigate, location, showNotification, setLoadingScreen]);

  return null; // No visible component, loading screen will show
};

export default OAuthCallback;
