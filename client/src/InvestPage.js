import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';

const InvestPage = ({ user }) => {
  const [amount, setAmount] = useState(500);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();
  const showNotification = useContext(NotificationContext);

  const calculateEquity = (amt) => {
    let base = (amt / 500) * 0.05;
    if (amt >= 5000) base *= 1.1;
    return base.toFixed(2);
  };

  const handleProceed = () => setShowTermsModal(true);

  const handleTermsAgreement = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://landing-page-gere.onrender.com/process-investment',
        { amount: Number(amount), termsAccepted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/invest-payment?amount=${amount}&equity=${calculateEquity(amount)}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to process agreement";
      showNotification('error', msg);
    }
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`PFCA CapiGrid Investment Terms and Conditions\n\n`, 10, 10);
    doc.text(`1. Investment Overview
- GHS 500 = 0.05% equity ownership in PFCA CapiGrid.
- Ownership proportional to company valuation.

2. Share Allocation
- Ownership rights include dividends & profit-sharing.
- Shares are non-transferable without consent.

3. Lock-in Period
- A 12-month lock-in period applies. Early withdrawal is not allowed.

4. Dividends
- Paid annually based on net profits and board approval.

5. Risks
- No guarantee of profit or return. Investment involves risks, including loss of capital.

6. Refund Policy
- Investments are non-refundable after confirmation.

7. Compliance
- Governed by Ghanaian laws.

8. Termination
- PFCA CapiGrid may modify or terminate this plan with prior notice.

9. Dispute Resolution
- Governed by Ghanaian laws and settled by arbitration.

10. Acknowledgment
- By proceeding, you agree to these terms and accept all associated risks.`, 10, 20);
    doc.save("PFCA_CapiGrid_Investment_Terms.pdf");
  };

const TermsModal = () => (
  <div className="terms-modal-overlay">
    <div className="terms-modal">
      <div className="modal-header">
        <button 
          className="modal-close-button"
          onClick={() => setShowTermsModal(false)}
        >
          &larr; Back
        </button>
        <h2>PFCA CapiGrid Investment Terms</h2>
      </div>
        
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
          <div className="modal-buttons">
            <button className="download-pdf" onClick={downloadPDF}>
              Download Full Terms (PDF)
            </button>
            <button 
              className="agree-button" 
              onClick={handleTermsAgreement}
            >
              I Have Read & Agree to Continue Payment
            </button>
          </div>
          
          <p className="terms-acknowledgement">
            By clicking "Agree", you confirm you've read and accepted all terms and conditions
          </p>
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
