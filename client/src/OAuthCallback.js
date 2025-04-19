import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useContext(NotificationContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      showNotification('error', "Google login failed");
      navigate('/');
    }
  }, [navigate, location]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
