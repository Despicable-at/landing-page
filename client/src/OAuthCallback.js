import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotification();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
  const handleOAuthCallback = async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(error || 'Authentication failed');
      }

      if (!token) {
        throw new Error('No authentication token received');
      }

      // Validate token format before storing
      if (typeof token !== 'string' || token.length < 10) {
        throw new Error('Invalid token format');
      }

      // Store token in sessionStorage (or localStorage if needed)
      sessionStorage.setItem('token', token);

      setStatus('Authentication successful! Redirecting...');
      showNotification('success', 'Logged in successfully');

      // Wait for notification to show before redirect
      setTimeout(() => navigate('/dashboard'), 1500);  // Corrected redirection path

    } catch (err) {
      const errorMessage = err.message.replace(/_/g, ' ');
      setStatus(`Error: ${errorMessage}`);
      showNotification('error', errorMessage);
      setTimeout(() => navigate('/'), 3000);
    }
  };


    handleOAuthCallback();
  }, [navigate, location, showNotification]);

  return (
    <div className="oauth-callback-container">
      <div className="loading-spinner"></div>
      <p className="status-message">{status}</p>
    </div>
  );
};

export default OAuthCallback;
