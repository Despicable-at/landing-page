import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = ({ setLoadingScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

  useEffect(() => {
    setLoadingScreen(true);
    
    // Handle URL format with potential double slash
    const hash = window.location.hash.replace('//#', '/#');
    const hashParams = new URLSearchParams(hash.split("?")[1]);
    const queryParams = new URLSearchParams(location.search);
    
    const token = hashParams.get('token') || queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('storage'));
      
      // Force navigation check
      if (window.location.pathname !== '/dashboard') {
        navigate('/dashboard'); // Use React Router navigation instead of window.location
      }
    } else {
      setLoadingScreen(false);
      const error = hashParams.get('error') || queryParams.get('error');
      showNotification('error', `Google login failed: ${error || 'No token received'}`);
      navigate('/');
    }
  }, [navigate, location, showNotification, setLoadingScreen]);

  return null;
};

export default OAuthCallback;
