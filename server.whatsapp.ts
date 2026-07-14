// WhatsApp API Routes with Baileys 6.x
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import qrcode from 'qrcode';
import { Router } from 'express';

// Create router for WhatsApp routes
const whatsappRouter = Router();

// WhatsApp sessions directory
const SESSIONS_DIR = path.join(process.cwd(), 'storage', 'whatsapp-sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Store QR codes for polling
const qrCodes = new Map();

// Global socket reference
let waSocket: any = null;
let isConnected = false;
let phoneNumber: string | null = null;

// Logger
const logger = pino({ level: 'silent' });

// Connect to WhatsApp
async function connectWhatsApp() {
  const sessionPath = path.join(SESSIONS_DIR, 'main');

  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  try {
    const { state, saveState } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      logger,
      printQRInTerminal: false,
      generateHighQualityLinkPreview: true,
    });

    // Listen to connection updates
    sock.on('connection.update', ({ connection, lastDisconnect, qr }: any) => {
      if (qr) {
        qrcode.toDataURL(qr, {
          width: 300,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        }).then((qrDataUrl: string) => {
          qrCodes.set('main', qrDataUrl);
        }).catch(console.error);
      }

      if (connection === 'open') {
        isConnected = true;
        phoneNumber = sock.user?.id?.split(':')[0] || null;
        qrCodes.delete('main');
        waSocket = sock;
        console.log(`✅ WhatsApp connected: ${phoneNumber}`);
      }

      if (connection === 'close') {
        isConnected = false;
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log('Reconnecting...');
          connectWhatsApp();
        }
      }
    });

    // Save credentials on update
    sock.on('creds.update', saveState);

    return sock;
  } catch (error) {
    console.error('WhatsApp connection error:', error);
    throw error;
  }
}

// Send message function
async function sendWaMessage(phone: string, message: string) {
  if (!waSocket || !isConnected) {
    throw new Error('WhatsApp not connected');
  }

  // Format phone number
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  }
  if (!formattedPhone.endsWith('@s.whatsapp.net')) {
    formattedPhone = formattedPhone + '@s.whatsapp.net';
  }

  try {
    const result = await waSocket.sendMessage(formattedPhone, { text: message });
    return { success: true, messageId: result.key.id };
  } catch (error: any) {
    console.error('Send error:', error);
    return { success: false, error: error.message };
  }
}

// Disconnect function
function disconnectWhatsApp() {
  if (waSocket) {
    waSocket.end();
    waSocket = null;
    isConnected = false;
    phoneNumber = null;
  }
}

// ============= API ROUTES =============

// Get WhatsApp status
whatsappRouter.get('/status', (req, res) => {
  const qr = qrCodes.get('main');
  res.json({
    connected: isConnected,
    phone: phoneNumber,
    hasQR: !!qr && !isConnected,
    qr: qr || null,
    ready: isConnected
  });
});

// Connect WhatsApp
whatsappRouter.post('/connect', async (req, res) => {
  try {
    if (isConnected) {
      return res.json({ success: true, message: 'Already connected', phone: phoneNumber });
    }

    await connectWhatsApp();
    res.json({ success: true, message: 'QR code generated' });
  } catch (error: any) {
    console.error('Connect error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get QR code
whatsappRouter.get('/qr', (req, res) => {
  const qr = qrCodes.get('main');
  res.json({
    hasQR: !!qr && !isConnected,
    connected: isConnected,
    phone: phoneNumber,
    qr: qr
  });
});

// Disconnect WhatsApp
whatsappRouter.post('/disconnect', (req, res) => {
  try {
    disconnectWhatsApp();
    qrCodes.delete('main');
    res.json({ success: true, message: 'Disconnected' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message
whatsappRouter.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message required' });
    }

    if (!isConnected) {
      return res.status(400).json({ error: 'WhatsApp not connected' });
    }

    const result = await sendWaMessage(phone, message);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
    console.error('Send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============= EXPORT =============
export { whatsappRouter, connectWhatsApp, sendWaMessage, disconnectWhatsApp };
console.log('✅ WhatsApp Baileys routes loaded');
