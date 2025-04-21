import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Example hash: "#/oauth-callback?token=XYZ"
    const hash = window.location.hash;                    // "#/oauth-callback?token=XYZ"
    const [, queryString] = hash.split('?');             // ["#/oauth-callback", "token=XYZ"]
    const token = queryString
      ? new URLSearchParams(queryString).get('token')
      : null;

    if (token) {
      // Store token and update app state
      localStorage.setItem('token', token);
      setToken(token);

      // Navigate into dashboard and replace history entry
      navigate('/dashboard', { replace: true });
    } else {
      // No token? Send them back to login
      navigate('/', { replace: true });
    }
  }, [navigate, setToken]);

  return null;
};

export default OAuthCallback;
