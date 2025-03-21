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

const handleProceed = async () => {
  if (agreed) {
    try {
      await axios.post('https://capigrid-backend.onrender.com/save-terms-acceptance', {
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
    doc.text(`PFCA CapiGrid Investment Terms and Conditions\n\n1. Investment Overview...\n`, 10, 10);
    doc.save("PFCA_CapiGrid_Investment_Terms.pdf");
  };

  return (
    <div className="auth-container">
      <h2>PFCA CapiGrid Investment Plan</h2>
      <p>GHS 500 - GHS 10,000 Range | Bonus Equity for GHS 5,000+</p>

      <label>Choose Investment Amount (GHS):</label>
      <input 
        type="range" 
        min="500" 
        max="10000" 
        step="100" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      <p><strong>Amount:</strong> GHS {amount}</p>
      <p><strong>Estimated Equity:</strong> {calculateEquity(amount)}%</p>

      {/* Legal Terms Scroll */}
      <div style={{ maxHeight: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        <p><strong>1. Investment Overview:</strong> You are purchasing equity shares in PFCA CapiGrid...</p>
        <p><strong>2. Share Allocation:</strong> Equity ownership, dividends, non-transferable without consent.</p>
        <p><strong>3. Lock-in Period:</strong> 12 months minimum hold period.</p>
        <p><strong>4. Dividends:</strong> Paid annually if declared by the board.</p>
        <p><strong>5. Risk:</strong> You acknowledge investment risks including loss of capital.</p>
        <p><strong>6. Non-Refundable:</strong> Payments cannot be reversed after success.</p>
        <p><strong>7. Legal:</strong> Governed by Ghanaian Law.</p>
        <p><strong>8. Dispute:</strong> Settled by arbitration in Ghana.</p>
      </div>

      <button onClick={downloadPDF}>Download Terms (PDF)</button>
      <br/><br/>
      <label><input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} /> I agree to the Terms & Conditions</label>

      <button onClick={handleProceed} style={{ marginTop: '20px' }}>Proceed to Payment</button>
    </div>
  );
};

export default InvestPage;
