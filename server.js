
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Campaign = mongoose.model('Campaign', { title: String, description: String });
const Donation = mongoose.model('Donation', { email: String, transactionId: String, amount: Number });

app.get('/campaigns', async (req, res) => {
    const campaigns = await Campaign.find();
    res.json(campaigns);
});

app.post('/donate', async (req, res) => {
    const { email, amount } = req.body;
    const transactionId = `TXN-${Date.now()}`;
    const newDonation = new Donation({ email, transactionId, amount });
    await newDonation.save();
    res.json({ message: 'Donation recorded', transactionId });
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Backend API running on port', PORT));
