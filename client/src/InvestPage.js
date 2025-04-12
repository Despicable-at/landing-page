import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const InvestPage = ({ user }) => {
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState(500);
  const navigate = useNavigate();

  // Maintain existing backend logic
  const calculateEquity = (amt) => {
    let base = (amt / 500) * 0.05;
    if (amt >= 5000) base *= 1.1;
    return base.toFixed(2);
  };

  const handleProceed = async () => {
    if (!agreed) {
      alert("You must agree to the terms before proceeding.");
      return;
    }
    try {
      await axios.post('https://landing-page-gere.onrender.com/save-terms-acceptance', {
        userId: user?._id,
        email: user?.email,
        amount,
        estimatedEquity: calculateEquity(amount)
      });
      navigate(`/invest-payment?amount=${amount}&equity=${calculateEquity(amount)}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save your acceptance. Try again.");
    }
  };

  const downloadPDF = () => {
    // Existing PDF generation code
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
      <div className="investment-header">
        <h2>PFCA CapiGrid Investment Plan</h2>
        <p className="investment-subtitle">GHS 500 - GHS 10,000 Range | Bonus Equity for GHS 5,000+</p>
      </div>

      <div className="amount-control-container">
        <div className="amount-selector">
          <button 
            className="amount-button"
            onClick={() => setAmount(prev => Math.max(500, prev - 100))}
          >
            -
          </button>
          <div className="amount-display">
            <span className="currency">GHS</span>
            <input
              type="number"
              value={amount}
              min="500"
              max="10000"
              onChange={(e) => setAmount(Math.max(500, Math.min(10000, e.target.value)))}
              className="amount-input"
            />
          </div>
            <button 
              className="amount-button"
              onClick={() => setAmount(prev => Math.min(10000, prev + 100))}
            >
            +
          </button>
        </div>

        <div className="equity-display">
          <div className="metric-box">
            <span className="metric-label">Investment Amount</span>
            <span className="metric-value">GHS {amount}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Estimated Equity</span>
            <span className="metric-value">{calculateEquity(amount)}%</span>
          </div>
        </div>
      </div>

      <div className="terms-container">
        <div className="terms-box">
          <h3 className="terms-title">Investment Terms</h3>
          {/* Existing terms content */}
        </div>

        <div className="terms-agreement">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="terms-checkbox"
            />
            <span>I agree to the Terms & Conditions</span>
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="download-button"
          onClick={downloadPDF}
        >
          Download Full Terms (PDF)
        </button>
        <button 
          className="proceed-button"
          onClick={handleProceed}
        >
          Proceed to Secure Payment
        </button>
      </div>
    </div>
  );
};

export default InvestPage;
