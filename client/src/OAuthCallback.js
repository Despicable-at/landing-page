import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // First try to get token from hash (new flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let token = hashParams.get('token');
    
    // Fallback to query params (old flow)
    if (!token) {
      const queryParams = new URLSearchParams(window.location.search);
      token = queryParams.get('token');
    }

    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      // Force hard redirect to ensure dashboard loads
      window.location.href = `${window.location.origin}/#/dashboard`;
    } else {
      navigate('/');
    }
  }, [navigate, setToken]);

  return null;
};

export default OAuthCallback;
