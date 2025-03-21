import React from 'react';
import { useLocation } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount');
  const equity = params.get('equity');
  const reference = params.get('ref');

  return (
    <div className="auth-container">
      <h2>🎉 Payment Successful</h2>
      <p>Thank you for investing GHS {amount}.</p>
      <p>Your equity: <strong>{equity}%</strong></p>
      <p>Transaction Ref: <strong>{reference}</strong></p>
      <p>A receipt has been sent to your email.</p>
    </div>
  );
};

export default ThankYou;
