require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Models
const User = mongoose.model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: { type: Boolean, default: false },
  verificationCode: String,
  profilePic: String
});
const Campaign = mongoose.model('Campaign', { title: String, description: String, goal: Number, raised: Number, userId: String });
const PreRegister = mongoose.model('PreRegister', { email: String });

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ✅ Session & Passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://landing-page-gere.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: '',
        verified: true
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// ✅ Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL}/#/oauth-callback?token=${token}`);
  }
);

// ✅ Root Route
app.get('/', (req, res) => res.send('PFCA CapiGrid Backend is running ✅'));

// ✅ Signup Route
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = new User({ email, password: hashed, name, verificationCode, verified: false });
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PFCA CapiGrid Verification Code',
      text: `Your verification code is: ${verificationCode}`
    });

    res.json({ message: 'Signup successful. Check your email for the code.' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ✅ Email Verification
app.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verificationCode != code) return res.status(400).json({ message: 'Invalid code' });

    user.verified = true;
    user.verificationCode = null;
    await user.save();
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

// ✅ Resend Verification Code
app.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verified) return res.json({ message: 'Email already verified' });

    if (!user.verificationCode) {
      user.verificationCode = Math.floor(100000 + Math.random() * 900000);
      await user.save();
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'PFCA CapiGrid Resend Verification Code',
      text: `Your verification code is: ${user.verificationCode}`
    });

    res.json({ message: 'Verification code resent successfully.' });
  } catch (err) {
    console.error('Resend Error:', err);
    res.status(500).json({ message: 'Failed to resend verification code.' });
  }
});

// ✅ Login with redirect to /verify if unverified
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) 
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.verified) {
      // ✅ Tell frontend to redirect to verify page
      return res.status(403).json({ message: 'Email not verified', status: 'unverified' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ Get Authenticated User
app.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get User Error:', err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Profile Update with Cloudinary
app.put('/update-profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { name, email, currentPassword, newPassword, profilePic } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (name) user.name = name;
    if (email) user.email = email;

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (profilePic) user.profilePic = profilePic;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ✅ Campaigns
app.get('/campaigns', async (req, res) => {
  const campaigns = await Campaign.find();
  res.json(campaigns);
});

// ✅ Pre-Registration
app.post('/pre-register', async (req, res) => {
  const { email } = req.body;
  await PreRegister.create({ email });
  res.json({ message: 'Pre-Registration successful!' });
});

// ✅ Optional Cloudinary Direct Upload
app.post('/upload-image', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploaded = await cloudinary.uploader.upload(fileStr, { folder: 'pfca' });
    res.json({ url: uploaded.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ error: 'Cloudinary upload failed' });
  }
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ PFCA CapiGrid Backend running on port ${PORT}`));
