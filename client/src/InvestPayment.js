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
      key: 'pk_test_bcc2176c6a383d2832ff3be512ddf3357913ca0a', // ✅ Replace with your live key
      email: user?.email,
      amount: amount * 100, // Paystack reads in kobo/pesewas
      currency: 'GHS',
      callback: function (response) {
        setLoading(false);
        alert(`✅ Investment Successful! Ref: ${response.reference}`);

        // ✅ 1. Save to Database
        axios.post('https://landing-page-gere.onrender.com/record-investment', {
          userId: user._id,
          email: user.email,
          amount,
          equityPercent: equity,
          paystackRef: response.reference
        });

              // ✅ Auto-send Email Receipt
      await axios.post('https://landing-page-gere.onrender.com/send-investment-receipt', {
        email: user.email,
        amount,
        equityPercent: equity,
        paystackRef: response.reference
      });
        
        // ✅ 2. Auto-send Receipt Email with PDF
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

    
      // ✅ Redirect to Confirmation Page
      navigate(`/thank-you?amount=${amount}&equity=${equity}&ref=${response.reference}`);
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

      {loading ? (
        <p>Processing Payment... ⏳</p>
      ) : (
        <button onClick={handlePaystack}>Pay with Paystack</button>
      )}
    </div>
  );
};

export default InvestPayment;
