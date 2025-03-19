require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection - make sure your MONGO_URI contains the correct database name (capigrid)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// Database Models
const Campaign = mongoose.model('Campaign', { title: String, description: String });
const Donation = mongoose.model('Donation', { email: String, transactionId: String, amount: Number });

// Root Route to check if backend is running
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// Test Route to confirm backend works
app.get('/test', (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// Get all campaigns
app.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// Handle Donations
app.post('/donate', async (req, res) => {
  const { email, amount } = req.body;
  const transactionId = `TXN-${Date.now()}`;
  const newDonation = new Donation({ email, transactionId, amount });
  await newDonation.save();
  res.json({ message: 'Donation recorded', transactionId });
});

// Send payment receipt email
app.post('/send-payment-email', async (req, res) => {
  const { email, transactionId, amount } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PFCA CapiGrid Donation Receipt',
    text: `Thank you for your donation!\nTransaction ID: ${transactionId}\nAmount: GHS ${amount}`
  };
  await transporter.sendMail(mailOptions);
  res.json({ message: 'Email sent' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Backend API running on port', PORT));
