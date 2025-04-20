import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email] = useState(localStorage.getItem('pendingEmail') || '');
  const [code, setCode] = useState('');
  const showNotification = useNotification();
  const [message, setMessage] = useState('');
  const [resendMsg, setResendMsg] = useState('');

const handleVerify = async () => {
  try {
    const res = await axios.post('https://landing-page-gere.onrender.com/verify-email', { email, code });
    setMessage(res.data.message); // ✅ Set message
    showNotification('success', res.data.message);
    localStorage.removeItem('pendingEmail');
    setTimeout(() => navigate('/'), 3000);
  } catch (err) {
    showNotification('error', err.response?.data?.message || 'Verification failed');
  }
};

const handleResend = async () => {
  try {
    const res = await axios.post('https://landing-page-gere.onrender.com/resend-verification', { email });
    setResendMsg(res.data.message); // ✅ Set resend message
    showNotification('success', res.data.message);
  } catch (err) {
    showNotification('error', err.response?.data?.message || 'Resend failed');
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

      <button style={{ backgroundColor: '#444', color: '#fff' }} onClick={handleResend}>
        Resend Code
      </button>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
      {resendMsg && <p style={{ marginTop: '10px', color: 'blue' }}>{resendMsg}</p>}
    </div>
  );
};

export default VerifyEmail;
