import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Pull token from search params
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');  // ✅ Redirect to dashboard
    } else {
      alert("Google login failed or token missing.");
      navigate('/');
    }
  }, [navigate, location]);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
