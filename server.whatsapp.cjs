// WhatsApp API Routes - MULTI-TENANT (One WhatsApp per User)
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const express = require('express');

const whatsappRouter = express.Router();

// WhatsApp sessions directory
const SESSIONS_DIR = path.join(process.cwd(), 'storage', 'whatsapp-sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Store active clients per user_id
const waClients = new Map();

// Helper: Get or create client for a user
function getOrCreateClient(userId) {
  if (waClients.has(userId)) {
    return waClients.get(userId);
  }

  const userSessionDir = path.join(SESSIONS_DIR, `user_${userId}`);

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: userSessionDir,
      clientId: `user_${userId}`
    }),
    puppeteer: {
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--single-process',
        '--disable-software-rasterizer'
      ]
    }
  });

  // Store client data
  const clientData = {
    client,
    isConnected: false,
    isInitializing: false,
    phoneNumber: null,
    qrCodeData: null
  };

  // QR event
  client.on('qr', async (qr) => {
    try {
      const qrImage = await QRCode.toDataURL(qr, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' }
      });
      clientData.qrCodeData = qrImage;
      console.log(`📱 QR Code generated for user ${userId}`);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  });

  // Ready event
  client.on('ready', () => {
    clientData.isConnected = true;
    clientData.isInitializing = false;
    clientData.phoneNumber = client.info?.wid?.user || null;
    clientData.qrCodeData = null;
    console.log(`✅ WhatsApp connected for user ${userId}: ${clientData.phoneNumber}`);
  });

  // Authenticated
  client.on('authenticated', () => {
    console.log(`✅ User ${userId} authenticated`);
    clientData.isInitializing = false;
  });

  // Disconnected
  client.on('disconnected', () => {
    clientData.isConnected = false;
    clientData.phoneNumber = null;
    clientData.qrCodeData = null;
    console.log(`❌ User ${userId} disconnected`);
  });

  // Auth failure
  client.on('auth_failure', (error) => {
    console.error(`Auth failure for user ${userId}:`, error);
    clientData.isInitializing = false;
    clientData.isConnected = false;
  });

  waClients.set(userId, clientData);
  return clientData;
}

// Disconnect and remove client for a user
function disconnectClient(userId) {
  const clientData = waClients.get(userId);
  if (clientData) {
    try {
      clientData.client.destroy();
    } catch (e) {}
    waClients.delete(userId);
  }
}

// ============= API ROUTES =============

// Get WhatsApp status for current user
whatsappRouter.get('/status', (req, res) => {
  const userId = req.query.user_id || 'default';

  if (!waClients.has(userId)) {
    return res.json({
      connected: false,
      phone: null,
      hasQR: false,
      qr: null,
      ready: false,
      initializing: false,
      user_id: userId
    });
  }

  const clientData = waClients.get(userId);
  res.json({
    connected: clientData.isConnected,
    phone: clientData.phoneNumber,
    hasQR: !!clientData.qrCodeData,
    qr: clientData.qrCodeData,
    ready: clientData.isConnected,
    initializing: clientData.isInitializing,
    user_id: userId
  });
});

// Connect WhatsApp for a user
whatsappRouter.post('/connect', (req, res) => {
  const userId = req.body.user_id || req.query.user_id || 'default';

  const clientData = getOrCreateClient(userId);

  if (clientData.isConnected) {
    return res.json({
      success: true,
      message: 'Already connected',
      phone: clientData.phoneNumber,
      user_id: userId
    });
  }

  if (clientData.isInitializing) {
    return res.json({
      success: true,
      message: 'Already initializing...',
      hasQR: !!clientData.qrCodeData,
      qr: clientData.qrCodeData,
      user_id: userId
    });
  }

  clientData.isInitializing = true;
  clientData.qrCodeData = null;

  // Initialize asynchronously
  clientData.client.initialize().catch((error) => {
    console.error('Initialization error:', error);
    clientData.isInitializing = false;
  });

  res.json({
    success: true,
    message: 'QR code being generated...',
    user_id: userId
  });
});

// Get QR code for a user
whatsappRouter.get('/qr', (req, res) => {
  const userId = req.query.user_id || 'default';

  if (!waClients.has(userId)) {
    return res.json({
      hasQR: false,
      connected: false,
      phone: null,
      qr: null,
      initializing: false,
      user_id: userId
    });
  }

  const clientData = waClients.get(userId);
  res.json({
    hasQR: !!clientData.qrCodeData,
    connected: clientData.isConnected,
    phone: clientData.phoneNumber,
    qr: clientData.qrCodeData,
    initializing: clientData.isInitializing,
    user_id: userId
  });
});

// Disconnect WhatsApp for a user
whatsappRouter.post('/disconnect', (req, res) => {
  const userId = req.body.user_id || req.query.user_id || 'default';
  disconnectClient(userId);

  res.json({
    success: true,
    message: 'Disconnected',
    user_id: userId
  });
});

// Send message for a user
whatsappRouter.post('/send', async (req, res) => {
  const userId = req.body.user_id || req.query.user_id || 'default';
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message required' });
  }

  if (!waClients.has(userId)) {
    return res.status(400).json({ error: 'WhatsApp not connected for this user' });
  }

  const clientData = waClients.get(userId);

  if (!clientData.isConnected) {
    return res.status(400).json({ error: 'WhatsApp not connected for this user' });
  }

  // Format phone number
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  }
  if (!formattedPhone.endsWith('@c.us')) {
    formattedPhone = formattedPhone + '@c.us';
  }

  try {
    const result = await clientData.client.sendMessage(formattedPhone, message);
    res.json({
      success: true,
      messageId: result.id.id || result.id._serialized,
      user_id: userId
    });
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all connected users
whatsappRouter.get('/users', (req, res) => {
  const users = [];

  waClients.forEach((clientData, userId) => {
    users.push({
      user_id: userId,
      connected: clientData.isConnected,
      phone: clientData.phoneNumber,
      initializing: clientData.isInitializing
    });
  });

  res.json({ users, total: users.length });
});

// ============= EXPORT =============
module.exports = { whatsappRouter };
