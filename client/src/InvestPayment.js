import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from './NotificationContext';

const InvestPayment = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showNotification = useNotification();
  
  const params = new URLSearchParams(location.search);
  const initialAmount = parseInt(params.get('amount')) || 500;
  const initialEquity = parseFloat(params.get('equity')) || 0.05;
  
  const [loading, setLoading] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);

  const validateAmount = (amount) => {
    return !isNaN(amount) && amount >= 500 && amount <= 10000;
  };

  const handlePaystack = async () => {
    if (!user?.email) {
      showNotification('error', 'Please log in to continue with payment');
      navigate('/login');
      return;
    }

    if (!validateAmount(initialAmount)) {
      showNotification('error', 'Invalid investment amount (500-10,000 GHS only)');
      return;
    }

    try {
      setLoading(true);
      setPaymentStarted(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Session expired - please login again');
        navigate('/login');
        return;
      }

      // Initialize payment
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: initialAmount * 100,
        currency: 'GHS',
        callback: async (response) => await handlePaymentCallback(response),
        onClose: () => handlePaymentClose()
      });

      handler.openIframe();
    } catch (err) {
      showNotification('error', 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const handlePaymentCallback = async (response) => {
    try {
      // Verify payment with backend
      const verifyRes = await axios.get(
        `https://landing-page-gere.onrender.com/verify-payment/${response.reference}`
      );

      if (verifyRes.data.status !== 'success') {
        throw new Error('Payment verification failed');
      }

      // Record investment
      await axios.post(
        'https://landing-page-gere.onrender.com/record-investment',
        { 
          amount: initialAmount,
          paystackRef: response.reference,
          equity: initialEquity
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      );

      // Send receipt
      await axios.post(
        'https://landing-page-gere.onrender.com/send-investment-receipt',
        {
          email: user.email,
          amount: initialAmount,
          equityPercent: initialEquity,
          paystackRef: response.reference
        }
      );

      navigate(`/thank-you?ref=${response.reference}`);
      showNotification('success', 'Payment processed successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showNotification('error', `Payment failed: ${errorMessage}`);
      navigate('/invest');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClose = () => {
    if (!paymentStarted) return;
    
    showNotification('warning', `
      Payment window closed - complete within 24 hours. 
      Check your email if you started the payment.
    `);
    setLoading(false);
  };

  return (
    <div className="auth-container" role="main">
      <h2>Confirm Your Investment</h2>
      <div className="investment-summary">
        <p>Amount: <strong>GHS {initialAmount.toLocaleString()}</strong></p>
        <p>Equity Stake: <strong>{initialEquity}%</strong></p>
      </div>

      {loading ? (
        <div className="payment-status">
          <div className="spinner" aria-label="Processing payment"></div>
          <p>Processing Payment...</p>
          <p className="payment-instructions">
            Please keep this window open until payment completes.
            A receipt will be sent to {user?.email}
          </p>
        </div>
      ) : (
        <div className="payment-actions">
          <button
            onClick={handlePaystack}
            disabled={loading}
            className="payment-button"
            aria-label="Proceed to Paystack payment"
          >
            Secure Payment via Paystack
          </button>
          <button
            onClick={() => navigate(-1)}
            className="cancel-button"
            aria-label="Cancel and go back"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestPayment;
