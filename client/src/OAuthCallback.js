import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = ({ setToken, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token); // ✅ Immediate storage like Version A
      setToken(token);
      navigate('/dashboard'); // ✅ Force immediate redirect
    }
  }, [navigate, setToken]);

  return <LoadingScreen />;
};

export default OAuthCallback;
