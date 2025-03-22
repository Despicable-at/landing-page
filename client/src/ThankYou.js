import React from 'react';
import { useLocation } from 'react-router-dom';
import './style.css';

const ThankYou = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount');
  const equity = params.get('equity');
  const reference = params.get('ref');

  return (
    <div className="thank-you-container">
      <h1>🎉 Payment Successful</h1>
      <p>Thank you for investing in <strong>PFCA CapiGrid</strong>.</p>

      <div className="summary-box">
        <p><strong>Amount Invested:</strong> GHS {amount}</p>
        <p><strong>Equity Earned:</strong> {equity}%</p>
        <p><strong>Transaction Ref:</strong> {reference}</p>
      </div>

      <p>A receipt has been sent to your email. You are officially part of the PFCA CapiGrid Family!</p>

      <button onClick={() => window.location.href = '/#/dashboard'}>Go to Dashboard</button>
    </div>
  );
};

export default ThankYou;
