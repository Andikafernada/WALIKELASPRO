// Payment routes
const express = require('express');
const paymentsRouter = express.Router();

const MIDTRANS_URL = 'https://app.sandbox.midtrans.com';
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-server-key';

// Get config for frontend
paymentsRouter.get('/config', (req, res) => {
  res.json({
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-client-key',
    url: MIDTRANS_URL,
    isProduction: process.env.MIDTRANS_ENV === 'production'
  });
});

// Create Snap Token
paymentsRouter.post('/create-snap-token', async (req, res) => {
  try {
    const { orderId, grossAmount, itemDetails, customerDetails } = req.body;

    // For sandbox, we'll return a mock token
    // In production, use Midtrans Snap API
    res.json({
      token: 'mock-snap-token-' + Date.now(),
      redirectUrl: MIDTRANS_URL + '/snap/v1/transactions'
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = paymentsRouter;
