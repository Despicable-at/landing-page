require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models
const User = mongoose.model('User', {
  email: String,
  password: String,
  verified: { type: Boolean, default: false }
});

const Campaign = mongoose.model('Campaign', { title: String, description: String, goal: Number, raised: Number });
const Donation = mongoose.model('Donation', { email: String, transactionId: String, amount: Number, campaignId: String });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Test if backend is running
app.get('/', (req, res) => {
  res.send('PFCA CapiGrid Backend is running ✅');
});

// Test Route
app.get('/test', (req, res) => {
  res.json({ message: "Backend works ✅" });
});

// User Signup with email verification
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your PFCA CapiGrid Email',
    text: `Click this link to verify your email: ${link}`
  });

  res.json({ message: 'Signup successful, verification email sent!' });
});

// Email verification
app.get('/verify-email', async (req, res) => {
  try {
    const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { verified: true });
    res.send('Email verified! You can now log in.');
  } catch {
    res.status(400).send('Invalid or expired token');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.verified) return res.status(401).json({ message: 'Please verify your email first' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Login successful' });
});

// Resend verification email
app.post('/resend-verification', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('User not found');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify your PFCA CapiGrid Email',
    text: `Click this link to verify your email: ${link}`
  });
  res.send('Verification email resent');
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
  const { email, amount, campaignId } = req.body;
  const transactionId = `TXN-${Date.now()}`;
  const newDonation = new Donation({ email, transactionId, amount, campaignId });
  await newDonation.save();

  // Update Campaign raised amount
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { raised: amount } });

  res.json({ message: 'Donation recorded', transactionId });
});

//Get User Data Route
app.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

//GEt User Campaigns
app.get('/my-campaigns', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const campaigns = await Campaign.find({ userId: decoded.id });
    res.json(campaigns);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

//Handle investment endpoint
app.post('/invest', async (req, res) => {
  const { userId, amount } = req.body;
  // You can save this in a DB collection called Investments
  console.log(`User ${userId} wants to invest GHS ${amount}`);
  res.json({ message: 'Investment recorded. We will contact you.' });
});

//Pre-registration endpoint
app.post('/pre-register', async (req, res) => {
  const { email } = req.body;
  // Optional: Save to MongoDB PreRegister collection
  console.log(`Pre-Registration received: ${email}`);
  res.json({ message: 'Pre-Registration successful!' });
});

// Send payment receipt email
app.post('/send-payment-email', async (req, res) => {
  const { email, transactionId, amount, campaignId } = req.body;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'PFCA CapiGrid Donation Receipt',
    text: `Thank you for your donation!\nTransaction ID: ${transactionId}\nCampaign: ${campaignId}\nAmount: GHS ${amount}`
  });
  res.json({ message: 'Email sent' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('PFCA CapiGrid Backend running on port', PORT));
