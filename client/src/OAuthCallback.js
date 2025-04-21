import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL hash
    const hash = window.location.hash.substring(1); // Remove the #
    const params = new URLSearchParams(hash);
    const token = params.get('token');

    if (token) {
      // Store token and update state
      localStorage.setItem('token', token);
      setToken(token);
      
      // Clear the hash and redirect to dashboard
      window.location.hash = '';
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, setToken]);

  return null; // No rendering needed
};

export default OAuthCallback;
