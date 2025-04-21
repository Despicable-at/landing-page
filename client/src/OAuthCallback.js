import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get both hash and query parameters
    const hash = window.location.hash.substring(1);
    const search = window.location.search;
    
    // Try hash first, then query params
    const params = new URLSearchParams(hash || search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      // Force dashboard navigation
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, setToken]);

  return null;
};

export default OAuthCallback;
