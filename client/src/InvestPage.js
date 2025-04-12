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
    if (amt >= 5000) base *= 1.1;
    return base.toFixed(2);
  };

  const incrementAmount = () => setAmount(prev => Math.min(Number(prev) + 100, 10000));
  const decrementAmount = () => setAmount(prev => Math.max(Number(prev) - 100, 500));

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
    const doc = new jsPDF();
    doc.text(`PFCA CapiGrid Investment Terms and Conditions\n\n`, 10, 10);
    doc.text(`1. Investment Overview\n- GHS 500 = 0.05% equity...`, 10, 20);
    doc.save("PFCA_CapiGrid_Investment_Terms.pdf");
  };

  return (
    <div className="auth-container">
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

    <div className="checkbox-wrapper" style={{ 
      display: 'flex',
      justifyContent: 'center',
      margin: '25px 0'
    }}>
      <label className="checkbox-label" style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input 
          type="checkbox" 
          checked={agreed} 
          onChange={() => setAgreed(!agreed)} 
          style={{ margin: 0 }}
        />
        <span>I agree to the Terms & Conditions</span>
      </label>
    </div>

    {/* Action Buttons */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <button onClick={handleProceed}>Proceed to Payment</button>
    </div>
  </div>
);
};

export default InvestPage;
