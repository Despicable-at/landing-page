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
    if (!user?.email) {
      alert('Please log in to continue with payment');
      navigate('/');
      return;
    }

    if (isNaN(amount) || amount < 500 || amount > 10000) {
      alert('Invalid investment amount');
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = window.PaystackPop.setup({
      key: 'pk_test_bcc2176c6a383d2832ff3be512ddf3357913ca0a',
      email: user.email,
      amount: amount * 100,
      currency: 'GHS',
      callback: async function (response) {
        try {
          const verifyResponse = await axios.get(
            `https://landing-page-gere.onrender.com/verify-payment/${response.reference}`
          );

          if (verifyResponse.data.data?.status !== 'success') {
            throw new Error('Payment verification failed');
          }

          await axios.post('https://landing-page-gere.onrender.com/record-investment', 
            {
              amount: Number(amount),
              paystackRef: response.reference
            }, 
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          await axios.post('https://landing-page-gere.onrender.com/send-investment-receipt', {
            email: user.email,
            amount: Number(amount),
            equityPercent: equity,
            paystackRef: response.reference
          });

          navigate(`/thank-you?ref=${response.reference}`);
        } catch (err) {
          console.error('Payment Error:', err);
          alert(`Payment failed: ${err.response?.data?.message || err.message}`);
        } finally {
          setLoading(false);
        }
      },
      onClose: function () {
        setLoading(false);
        alert('Payment window closed - complete your payment within 24 hours');
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
          className="payment-button"
        >
          {loading ? 'Processing...' : 'Pay with Paystack'}
        </button>
      )}
    </div>
  );
};

export default InvestPayment;
