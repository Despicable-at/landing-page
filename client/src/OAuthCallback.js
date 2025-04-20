// OAuthCallback.js - Final Fix
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();

  useEffect(() => {
    // 1. Check both fragment AND query parameters
    const queryParams = new URLSearchParams(location.search);
    const fragmentParams = new URLSearchParams(location.hash.substring(1));
    
    // 2. Handle both 'token' and 'access_token' parameter names
    const token = fragmentParams.get('token') || 
                 queryParams.get('token') ||
                 fragmentParams.get('access_token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard'); // Force redirect to dashboard
    } else {
      // 3. Show detailed error message
      const error = fragmentParams.get('error') || queryParams.get('error');
      showNotification('error', `Google login failed: ${error || 'No token received'}`);
      navigate('/');
    }
  }, [navigate, location, showNotification]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
