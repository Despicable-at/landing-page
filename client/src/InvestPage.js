import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const InvestPage = ({ user }) => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleProceed = async () => {
    if (agreed) {
      // ✅ Save acceptance to database
      await axios.post('https://your-backend-url/save-terms-acceptance', {
        userId: user?._id,
        email: user?.email
      });
      navigate('/invest-payment');
    } else {
      alert("You must agree to the terms before proceeding.");
    }
  };

  // ✅ PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`PFCA CapiGrid Investment Terms and Conditions`, 10, 10);
    doc.text(`
1. Investment Overview
- GHS 500 = 0.05% equity ownership in PFCA CapiGrid.
- Ownership proportional to company valuation.

2. Share Allocation
- Ownership rights include dividends & profit-sharing.
- Shares non-transferable without consent.

3. Lock-in Period
- 12-month lock-in period applies.
- Early withdrawal not allowed.

4. Dividends
- Paid annually based on net profits & board approval.

5. Risks
- No guarantee of profit or return.
- Investor may lose capital.

6. Refund Policy
- Non-refundable after confirmation.

7. Compliance
- Governed by Ghanaian laws.

8. Termination
- PFCA CapiGrid may modify or terminate plan with notice.

9. Dispute Resolution
- Governed by Ghanaian laws & settled by arbitration.

10. Acknowledgment
- By signing, you agree to these terms & accept all risks.
    `, 10, 20);
    doc.save("PFCA_CapiGrid_Investment_Terms.pdf");
  };

  return (
    <div className="auth-container">
      <h2>PFCA CapiGrid Investment Plan</h2>
      <p><strong>Investment Plan:</strong> GHS 500 = 0.05% equity shares.</p>
      <p><strong>Legal Terms & Conditions:</strong></p>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', padding: '10px', border: '1px solid #ccc' }}>
        {/* ✅ Full Legal Terms Display */}
        <p>By participating in this investment plan, you agree to purchase equity shares in PFCA CapiGrid...</p>
        {/* (Paste the full legal content from above here or as you did) */}
        {/* I can fill the full terms text inside if you want */}
      </div>

      <button onClick={downloadPDF}>Download Terms & Conditions (PDF)</button>

      <div style={{ marginTop: '20px' }}>
        <label>
          <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} /> I have read and agree to the Terms and Conditions.
        </label>
      </div>

      <button onClick={handleProceed} style={{ marginTop: '20px' }}>Proceed to Payment</button>
    </div>
  );
};

export default InvestPage;
