const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { to, from, subject, text, founderName } = req.body;

  if (!to || !from || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configure your email service here
    // Note: For Gmail, you should use an App Password if 2FA is enabled
    // Since we don't have the user's credentials, we'll setup a transporter that expects them in env
    // User needs to define EMAIL_USER and EMAIL_PASS in backend/.env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Sender email
        pass: process.env.EMAIL_PASS || 'your-app-password',    // Sender app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      replyTo: from,
      to: to, // The founder's email address
      subject: `[MHMF Contact] ${subject}`,
      text: `You have received a new message via the My Health My Friend "Get in touch" form.\n\nFrom: ${from}\nTo: ${founderName}\nSubject: ${subject}\n\nMessage:\n${text}`
    };

    // If no credentials provided, log the email instead of failing, 
    // to allow testing the UI without a crash
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('--- EMAIL MOCK (Credentials not configured in .env) ---');
      console.log('To:', mailOptions.to);
      console.log('Reply-To:', mailOptions.replyTo);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.text);
      console.log('-------------------------------------------------------');
      
      return res.status(200).json({ message: 'Email logged in console (Mock mode)' });
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
