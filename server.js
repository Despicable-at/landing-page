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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models
const User = mongoose.model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  verificationCode: String
});

const Campaign = mongoose.model('Campaign', { title: String, description: String, goal: Number, raised: Number, userId: String });
const Donation = mongoose.model('Donation', { email: String, transactionId: String, amount: Number, campaignId: String });
const PreRegister = mongoose.model('PreRegister', { email: String });
const Investment = mongoose.model('Investment', { userId: String, amount: Number });

// Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// ✅ SESSION SETUP
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ USER SERIALIZE
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ✅ GOOGLE STRATEGY SETUP
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,   // 🔥 Add this to your .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 🔥 Add this to your .env
  callbackURL: "https://capigrid-backend.onrender.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  // ✅ You can check if user exists or create new in MongoDB
  let user = await User.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = await User.create({
      email: profile.emails[0].value,
      password: '', // Optional for Google users
      verified: true
    });
  }
  done(null, user);
}
));

// ✅ GOOGLE AUTH ROUTES
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // ✅ Generate JWT token for the user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL}/#/?token=${token}`);
  }
);


// ✅ Root Route
app.get('/', (req, res) => res.send('PFCA CapiGrid Backend is running ✅'));

app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const user = new User({ email, password: hashed, name, verificationCode, verified: false });
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your PFCA CapiGrid Verification Code',
      text: `Your verification code is: ${verificationCode}`
    });

    res.json({ message: 'Signup successful. Check your email for the verification code.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});


// ✅ Verify Email Route
app.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.verified) return res.json({ message: "Email already verified" });
  if (user.verificationCode != code) return res.status(400).json({ message: 'Invalid verification code' });

  user.verified = true;
  user.verificationCode = null;
  await user.save();
  res.json({ message: 'Email verified successfully. You can now log in.' });
});

// ✅ Login Route (Check verification)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.verified) return res.status(403).json({ message: 'Please verify your email first' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, email: user.email } });
});

// ✅ Resend Verification Email
app.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');
  if (user.verified) return res.json({ message: "Email already verified" });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'PFCA CapiGrid Email Verification',
    text: `Your verification code is: ${user.verificationCode}`
  });

  res.json({ message: 'Verification email resent' });
});

app.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (parseInt(code) === user.verificationCode) {
      user.verified = true;
      user.verificationCode = null;
      await user.save();
      res.json({ message: 'Email verified successfully!' });
    } else {
      res.status(400).json({ message: 'Incorrect verification code' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});


// ✅ Get User Data
app.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Campaign Routes
app.get('/campaigns', async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

// ✅ Get My Campaigns
app.get('/my-campaigns', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const campaigns = await Campaign.find({ userId: decoded.id });
    res.json(campaigns);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Handle Donations
app.post('/donate', async (req, res) => {
  const { email, amount, campaignId } = req.body;
  const transactionId = `TXN-${Date.now()}`;
  const donation = new Donation({ email, transactionId, amount, campaignId });
  await donation.save();

  await Campaign.findByIdAndUpdate(campaignId, { $inc: { raised: amount } });
  res.json({ message: 'Donation recorded', transactionId });
});

// ✅ Send Payment Email
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

// ✅ Investment Endpoint
app.post('/invest', async (req, res) => {
  const { userId, amount } = req.body;
  await Investment.create({ userId, amount });
  res.json({ message: 'Investment recorded. We will contact you.' });
});

// ✅ Pre-Register Endpoint
app.post('/pre-register', async (req, res) => {
  const { email } = req.body;
  await PreRegister.create({ email });
  res.json({ message: 'Pre-Registration successful!' });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`PFCA CapiGrid Backend running on port ${PORT}`));
