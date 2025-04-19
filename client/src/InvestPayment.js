import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvestPayment = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const amount = params.get('amount') || 500;
  const equity = params.get('equity') || '0.05';
  const [loading, setLoading] = useState(false);

const handlePaystack = () => {
  setLoading(true);
  const handler = window.PaystackPop.setup({
    key: 'pk_test_bcc2176c6a383d2832ff3be512ddf3357913ca0a',
    email: user?.email,
    amount: amount * 100,
    currency: 'GHS',
    callback: async function (response) {
      try {
        // Verify transaction was actually successful
        const verifyResponse = await axios.get(
          `https://landing-page-gere.onrender.com/verify-payment/${response.reference}`
        );

        if (verifyResponse.data.status !== 'success') {
          throw new Error('Payment verification failed');
        }

        // Record investment
        await axios.post('https://landing-page-gere.onrender.com/record-investment', {
          amount,
          paystackRef: response.reference
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Send receipt
        await axios.post('https://landing-page-gere.onrender.com/send-investment-receipt', {
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });

        navigate(`/thank-you?ref=${response.reference}`);
      } catch (err) {
        console.error('Payment Processing Error:', err);
        alert(`Error: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    },
    onClose: function () {
      setLoading(false);
      alert('Payment window closed');
    }
  });

  handler.openIframe();
};

return (
  <div className="auth-container">
    <h2>Confirm Your Investment</h2>
    <p>Investing <strong>GHS {amount}</strong> for <strong>{equity}% equity</strong></p>

    {loading ? (
      <div className="processing-payment">
        <div className="spinner"></div>
        <p>Processing Payment...</p>
        <p className="processing-note">
          Please keep this window open until payment completes
        </p>
      </div>
    ) : (
      <button 
        onClick={handlePaystack}
        disabled={loading}
      >
        Pay with Paystack
      </button>
    )}
  </div>
);

export default InvestPayment;
