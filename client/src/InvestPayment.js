import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const InvestPayment = ({ user }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount') || 500;
  const equity = params.get('equity') || '0.05';
  const [loading, setLoading] = useState(false);

  const handlePaystack = () => {
    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: 'YOUR_PAYSTACK_PUBLIC_KEY',
      email: user?.email,
      amount: amount * 100,
      currency: 'GHS',
      callback: function (response) {
        setLoading(false);
        alert(`Investment Successful! Ref: ${response.reference}`);

        // ✅ Record Investment in DB
        axios.post('https://landing-page-gere.onrender.com/record-investment', {
          userId: user._id,
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });

        // ✅ Auto-send receipt email with PDF
        axios.post('https://landing-page-gere.onrender.com/send-investment-receipt', {
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });
      },
      onClose: function () {
        setLoading(false);
        alert('Transaction closed');
      }
    });
    handler.openIframe();
  };

  return (
    <div className="auth-container">
      <h2>Confirm Your Investment</h2>
      <p>Investing <strong>GHS {amount}</strong> for <strong>{equity}% equity</strong></p>

      {loading ? <p>Processing Payment...</p> :
        <button onClick={handlePaystack}>Pay with Paystack</button>
      }
    </div>
  );
};

export default InvestPayment;
