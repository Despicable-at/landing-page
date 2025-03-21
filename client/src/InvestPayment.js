import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const InvestPayment = ({ user }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount') || 500;
  const equity = params.get('equity') || '0.05';

  const handlePaystack = () => {
    const handler = window.PaystackPop.setup({
      key: 'your-paystack-public-key',
      email: user?.email,
      amount: amount * 100,
      currency: 'GHS',
      callback: function(response) {
        alert(`Investment Successful! Ref: ${response.reference}\nEquity: ${equity}%`);

        // ✅ Record Investment
        axios.post('https://your-backend-url/record-investment', {
          userId: user._id,
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });

        // ✅ Send Receipt Email
        axios.post('https://your-backend-url/send-investment-receipt', {
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });
      },
      onClose: function() {
        alert('Transaction closed');
      }
    });
    handler.openIframe();
  };

  return (
    <div className="auth-container">
      <h2>Confirm Your Investment</h2>
      <p>Investing <strong>GHS {amount}</strong> for <strong>{equity}% equity</strong></p>
      <button onClick={handlePaystack}>Pay with Paystack</button>
    </div>
  );
};

export default InvestPayment;
