import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const InvestPage = ({ user }) => {
  const [amount, setAmount] = useState(500);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalAgreed, setModalAgreed] = useState(false);
  const navigate = useNavigate();

  const calculateEquity = (amt) => {
    let base = (amt / 500) * 0.05;
    if (amt >= 5000) base *= 1.1;
    return base.toFixed(2);
  };

  const handleProceed = () => {
    setShowTermsModal(true);
  };

  const handleTermsAgreement = async () => {
    if (!modalAgreed) {
      alert("You must agree to the terms to continue");
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
    const doc = new jsPDF();
    doc.text(`PFCA CapiGrid Investment Terms and Conditions\n\n`, 10, 10);
    doc.text(`1. Investment Overview\n- GHS 500 = 0.05% equity ownership...`, 10, 20);
    doc.save("PFCA_CapiGrid_Investment_Terms.pdf");
  };

  const TermsModal = () => (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <h2>PFCA CapiGrid Investment Terms</h2>
        
        <div className="terms-content">
          <p><strong>1. Investment Overview:</strong> You are purchasing equity shares in PFCA CapiGrid...</p>
          <p><strong>2. Share Allocation:</strong> Equity ownership, dividends, non-transferable without consent.</p>
          <p><strong>3. Lock-in Period:</strong> 12 months minimum hold period.</p>
          <p><strong>4. Dividends:</strong> Paid annually if declared by the board.</p>
          <p><strong>5. Risk:</strong> You acknowledge investment risks including loss of capital.</p>
          <p><strong>6. Non-Refundable:</strong> Payments cannot be reversed after confirmation.</p>
          <p><strong>7. Legal:</strong> Governed by Ghanaian Law.</p>
          <p><strong>8. Dispute:</strong> Settled by arbitration in Ghana.</p>
        </div>

        <div className="modal-actions">
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={modalAgreed}
              onChange={(e) => setModalAgreed(e.target.checked)}
            />
            <span>I have read and agree to all terms and conditions</span>
          </label>

          <div className="modal-buttons">
            <button className="download-pdf" onClick={downloadPDF}>
              Download Full Terms (PDF)
            </button>
            <button 
              className="agree-button" 
              onClick={handleTermsAgreement}
              disabled={!modalAgreed}
            >
              Agree & Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
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

      <button className="proceed-button" onClick={handleProceed}>
        Review Terms & Proceed to Payment
      </button>

      {showTermsModal && <TermsModal />}
    </div>
  );
};

export default InvestPage;
