import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email] = useState(localStorage.getItem('pendingEmail') || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/verify-email', { email, code });
      setMessage(res.data.message);
      localStorage.removeItem('pendingEmail'); // ✅ Clean up after verification
      setTimeout(() => navigate('/'), 3000);   // ✅ Redirect to login
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <p>We have sent a verification code to: <strong>{email}</strong></p>

      <input
        type="text"
        placeholder="Enter Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default VerifyEmail;
