import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

  useEffect(() => {
    // Parse query parameters from location.search
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      showNotification('error', "Google login failed: No token received");
      navigate('/');
    }
  }, [navigate, location, showNotification]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
