import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get('token');
        const res = await axios.get(`https://capigrid-backend.onrender.com/verify-email?token=${token}`);
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => navigate('/'), 3000); // Redirect after 3 secs
      } catch (err) {
        setMessage('Invalid or expired token.');
      }
    };
    verify();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
