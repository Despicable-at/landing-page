import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useNotification } from './NotificationContext';

const InvestPage = ({ user }) => {
  const [amount, setAmount] = useState(500);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const showNotification = useNotification();

  const calculateEquity = (amt) => {
    const numericAmount = Number(amt);
    let base = (numericAmount / 500) * 0.05;
    if (numericAmount >= 5000) base *= 1.1;
    return base.toFixed(2);
  };

  const handleProceed = () => {
    if (!user) {
      showNotification('error', 'Please login to continue');
      navigate('/login');
      return;
    }
    setShowTermsModal(true);
  };

  const handleTermsAgreement = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('error', 'Session expired - please login again');
        navigate('/login');
        return;
      }

      await axios.post(
        'https://landing-page-gere.onrender.com/process-investment',
        { amount: Number(amount), termsAccepted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate(`/invest-payment?amount=${amount}&equity=${calculateEquity(amount)}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process agreement";
      showNotification('error', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('PFCA CapiGrid Investment Terms and Conditions', 10, 10);
    doc.setFontSize(10);
    doc.text(`
      1. Investment Overview
      - GHS 500 = 0.05% equity ownership in PFCA CapiGrid
      - Ownership proportional to company valuation

      2. Share Allocation
      - Ownership rights include dividends & profit-sharing
      - Shares are non-transferable without consent

      3. Lock-in Period
      - 12-month minimum hold period
      - Early withdrawal not permitted

      4. Dividends
      - Paid annually based on net profits
      - Subject to board approval

      5. Risks
      - No profit or return guarantees
      - Potential capital loss

      6. Refund Policy
      - Non-refundable after confirmation

      7. Legal Compliance
      - Governed by Ghanaian laws

      8. Termination
      - Modifications with prior notice

      9. Dispute Resolution
      - Arbitration in Ghana

      10. Acknowledgement
      - Acceptance of all terms and risks
    `, 10, 20);
    doc.save("PFCA_Investment_Terms.pdf");
  };

  const TermsModal = () => (
    <div className="terms-modal-overlay" role="dialog" aria-labelledby="terms-modal-title">
      <div className="terms-modal">
        <div className="modal-header">
          <button 
            className="modal-close-button"
            onClick={() => setShowTermsModal(false)}
            aria-label="Close terms modal"
          >
            &larr; Back
          </button>
          <h2 id="terms-modal-title">PFCA CapiGrid Investment Terms</h2>
        </div>
        
        <div className="terms-content">
          {/* Terms content remains same */}
        </div>

        <div className="modal-actions">
          <div className="modal-buttons">
            <button 
              className="download-pdf" 
              onClick={downloadPDF}
              aria-label="Download full terms as PDF"
            >
              Download Full Terms (PDF)
            </button>
            <button 
              className="agree-button" 
              onClick={handleTermsAgreement}
              disabled={isProcessing}
              aria-busy={isProcessing}
              aria-label="Agree to terms and continue"
            >
              {isProcessing ? 'Processing...' : 'I Agree & Continue to Payment'}
            </button>
          </div>
          
          <p className="terms-acknowledgement">
            By agreeing, you confirm acceptance of all terms
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="investment-header" aria-label="Investment plan header">
        <h2>PFCA CapiGrid Investment Plan</h2>
        <p className="investment-subtitle">
          Investment Range: GHS 500 - 10,000 | Bonus for GHS 5,000+
        </p>
      </header>

      <div className="amount-control-container">
        <div className="amount-selector" role="group" aria-label="Investment amount controls">
          <button 
            className="amount-button"
            onClick={() => setAmount(prev => Math.max(500, prev - 100))}
            aria-label="Decrease investment amount"
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
              step="100"
              onChange={(e) => {
                const value = Math.max(500, Math.min(10000, Number(e.target.value)));
                setAmount(value);
              }}
              className="amount-input"
              aria-label="Investment amount input"
            />
          </div>
          <button 
            className="amount-button"
            onClick={() => setAmount(prev => Math.min(10000, prev + 100))}
            aria-label="Increase investment amount"
          >
            +
          </button>
        </div>

        <div className="equity-display">
          <div className="metric-box" aria-label="Investment amount">
            <span className="metric-label">Amount</span>
            <span className="metric-value">GHS {amount}</span>
          </div>
          <div className="metric-box" aria-label="Estimated equity">
            <span className="metric-label">Equity</span>
            <span className="metric-value">{calculateEquity(amount)}%</span>
          </div>
        </div>
      </div>

      <button 
        className="proceed-button" 
        onClick={handleProceed}
        aria-label="Review terms and proceed to payment"
      >
        Review Terms & Proceed
      </button>

      {showTermsModal && <TermsModal />}
    </div>
  );
};

export default InvestPage;
