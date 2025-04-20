import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

  useEffect(() => {
    // Parse both hash and query parameters
    const hashParams = new URLSearchParams(location.hash.split("?")[1]);
    const queryParams = new URLSearchParams(location.search);
    
    const token = hashParams.get('token') || queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      const error = hashParams.get('error') || queryParams.get('error');
      showNotification('error', `Google login failed: ${error || 'No token received'}`);
      navigate('/');
    }
  }, [navigate, location, showNotification]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
