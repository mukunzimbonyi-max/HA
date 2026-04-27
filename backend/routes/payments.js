const express = require('express');
const router = express.Router();
const axios = require('axios');

// IremboPay Config (To be filled by user in .env)
const IREMBO_SECRET_KEY = process.env.IREMBO_SECRET_KEY || 'TST-SECRET-KEY';
const IREMBO_PUBLIC_KEY = process.env.IREMBO_PUBLIC_KEY || 'TST-PUBLIC-KEY';
const IREMBO_ACCOUNT_ID = process.env.IREMBO_ACCOUNT_ID || 'TST-RWF';
const IS_SANDBOX = process.env.IREMBO_MODE === 'live' ? false : true;
const BASE_URL = IS_SANDBOX ? 'https://api.sandbox.irembopay.com' : 'https://api.irembopay.com';

// Mock Invoice Creation
router.post('/create-invoice', async (req, res) => {
  const { amount, description, customer } = req.body;
  
  // If no real key, return a mock invoice
  if (IREMBO_SECRET_KEY === 'TST-SECRET-KEY') {
    return res.json({
      success: true,
      message: 'Mock Invoice Created',
      data: {
        invoiceNumber: 'INV-' + Math.floor(Math.random() * 1000000000),
        amount: amount,
        paymentLinkUrl: '#'
      }
    });
  }

  try {
    const response = await axios.post(`${BASE_URL}/payments/invoices`, {
      transactionId: 'TXN-' + Date.now(),
      paymentAccountIdentifier: IREMBO_ACCOUNT_ID,
      customer: customer,
      paymentItems: [{
        unitAmount: amount,
        quantity: 1,
        code: 'APP-FEE'
      }],
      description: description,
      language: 'EN'
    }, {
      headers: {
        'irembopay-secretKey': IREMBO_SECRET_KEY,
        'X-API-Version': '2',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('IremboPay Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create IremboPay invoice' });
  }
});

// Initiate Momo Push
router.post('/initiate-push', async (req, res) => {
  const { phone, provider, invoiceNumber } = req.body;

  if (IREMBO_SECRET_KEY === 'TST-SECRET-KEY') {
    return res.json({
      success: true,
      message: `Push notification sent to ${phone} (${provider})`
    });
  }

  try {
    const response = await axios.post(`${BASE_URL}/payments/transactions/initiate`, {
      accountIdentifier: phone,
      paymentProvider: provider.toUpperCase(),
      invoiceNumber: invoiceNumber
    }, {
      headers: {
        'X-API-Version': '2',
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Push Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate mobile money push' });
  }
});

module.exports = router;
