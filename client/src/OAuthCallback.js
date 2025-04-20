import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = ({ setLoadingScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

  useEffect(() => {
    setLoadingScreen(true);
    
    // Unified parameter parsing
    const hashParams = new URLSearchParams(location.hash.split("?")[1]);
    const queryParams = new URLSearchParams(location.search);
    const token = hashParams.get('token') || queryParams.get('token');

    if (token) {
      // Update both localStorage and state immediately
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('storage'));
      
      // Force React Router navigation
      navigate('/dashboard', { replace: true });
    } else {
      setLoadingScreen(false);
      const error = hashParams.get('error') || queryParams.get('error');
      showNotification('error', `Google login failed: ${error || 'No token received'}`);
      navigate('/', { replace: true });
    }
  }, [navigate, location, showNotification, setLoadingScreen]);

  return null;
};

export default OAuthCallback;
