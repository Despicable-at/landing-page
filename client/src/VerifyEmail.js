import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/verify-email', {
        email,
        code,
      });
      setMessage('✅ Email verified successfully! Redirecting...');
      setTimeout(() => navigate('/'), 3000); // Redirect to login
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Invalid code or verification failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <p>Please enter the verification code sent to your email.</p>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify}>Verify Email</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
