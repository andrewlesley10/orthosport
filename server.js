// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔐 configure your SMTP (ask your hosting provider if unsure)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. "mail.orthosports.lk"
  port: Number(process.env.SMTP_PORT) || 465, // 465 (SSL) or 587 (TLS)
  secure: true,                      // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,     // e.g. "info@orthosports.lk"
    pass: process.env.SMTP_PASS      // your email password / app password
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  try {
    await transporter.sendMail({
      from: `"Orthopaedic Surgery & Sports Medicine" <info@orthosports.lk>`,
      to: ['info@orthosports.lk', 'piremsaanth@orthosports.lk'],  // both get the mail
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}

    Message:
    ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });


    res.json({ ok: true });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

// (optional) serve your static site as well:
app.use(express.static('public')); // put index.html, script.js, styles.css in /public

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
