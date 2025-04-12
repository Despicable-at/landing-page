import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const InvestPage = ({ user }) => {
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState(500);
  const navigate = useNavigate();

  const calculateEquity = (amt) => {
    let base = (amt / 500) * 0.05;
    if (amt >= 5000) base *= 1.1; // 10% Bonus if 5000 or more
    return base.toFixed(2);
  };

  const incrementAmount = () => setAmount(prev => Math.min(Number(prev) + 100, 10000));
  const decrementAmount = () => setAmount(prev => Math.max(Number(prev) - 100, 500));

  const handleProceed = async () => {
    if (agreed) {
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
    } else {
      alert("You must agree to the terms before proceeding.");
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

  return (
    <div className="dashboard-container">
      <h2>PFCA CapiGrid Investment Plan</h2>
      <p>GHS 500 - GHS 10,000 Range | Bonus Equity for GHS 5,000+</p>

      <div className="invest-amount-container">
        <button onClick={decrementAmount}>-</button>
        <input 
          type="number" 
          value={amount} 
          min="500" 
          max="10000" 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <button onClick={incrementAmount}>+</button>
      </div>

      <p><strong>Amount:</strong> GHS {amount}</p>
      <p><strong>Estimated Equity:</strong> {calculateEquity(amount)}%</p>

      <div className="terms-box">
        <p><strong>1. Investment Overview:</strong> You are purchasing equity shares in PFCA CapiGrid...</p>
        <p><strong>2. Share Allocation:</strong> Equity ownership, dividends, non-transferable without consent.</p>
        <p><strong>3. Lock-in Period:</strong> 12 months minimum hold period.</p>
        <p><strong>4. Dividends:</strong> Paid annually if declared by the board.</p>
        <p><strong>5. Risk:</strong> You acknowledge investment risks including loss of capital.</p>
        <p><strong>6. Non-Refundable:</strong> Payments cannot be reversed after confirmation.</p>
        <p><strong>7. Legal:</strong> Governed by Ghanaian Law.</p>
        <p><strong>8. Dispute:</strong> Settled by arbitration in Ghana.</p>
      </div>

      <button onClick={downloadPDF}>Download Terms (PDF)</button>
        
      <button onClick={handleProceed} style={{ marginTop: '20px' }}>Proceed to Payment</button>
    </div>
    <label className="checkbox-label">
    <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
    <span>I agree to the Terms & Conditions</span>
  </label>
  );
};

export default InvestPage;
