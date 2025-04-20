import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = ({ setLoadingScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoadingScreen(true);
    
    // URL cleanup
    const cleanHash = window.location.hash
      .replace('//#', '/#')
      .replace('##', '#');
    
    const hashParams = new URLSearchParams(cleanHash.split('?')[1]);
    const token = hashParams.get('token');

    if (token) {
      // Direct storage bypass
      localStorage.setItem('token', token);
      window.location.href = '/#/dashboard'; // Hard navigation
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, setLoadingScreen]);

  return null;
};

export default OAuthCallback;
