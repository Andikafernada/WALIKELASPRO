import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from 'baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import path from 'path';
import fs from 'fs';

// WhatsApp sessions directory
const SESSIONS_DIR = path.join(process.cwd(), 'storage', 'whatsapp-sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// Store active sockets per user/class
const whatsappSessions = new Map();

// Logger
const logger = pino({ level: 'silent' });

export class WhatsAppService {
  constructor(sessionId = 'default') {
    this.sessionId = sessionId;
    this.sock = null;
    this.isConnected = false;
    this.qrCode = null;
    this.qrCallback = null;
    this.phoneNumber = null;
    this.connectionReady = false;
  }

  async init() {
    const sessionPath = path.join(SESSIONS_DIR, this.sessionId);

    // Create session directory if not exists
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    try {
      const { state, saveState, clearState } = await useMultiFileAuthState(sessionPath);

      // Fetch latest version
      const { version } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        version,
        auth: state,
        logger,
        printQRInTerminal: true,
        generateHighQualityLinkPreview: true,
      });

      // Save state when updated
      this.sock.ev.on('creds.update', saveState);

      // Connection update handler
      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          if (this.qrCallback) {
            this.qrCallback(qr);
          }
        }

        if (connection === 'open') {
          this.isConnected = true;
          this.connectionReady = true;
          this.qrCode = null;
          this.phoneNumber = this.sock.user?.id?.split(':')[0] || null;
          console.log(`✅ WhatsApp connected: ${this.phoneNumber}`);
        }

        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          this.isConnected = false;

          if (shouldReconnect) {
            console.log('Reconnecting...');
            await this.init();
          } else {
            await clearState();
            console.log('Logged out, need to scan QR again');
          }
        }
      });

      return this.sock;
    } catch (error) {
      console.error('WhatsApp init error:', error);
      throw error;
    }
  }

  onQR(callback) {
    this.qrCallback = callback;
  }

  async sendMessage(phone, message) {
    if (!this.sock || !this.isConnected) {
      throw new Error('WhatsApp not connected');
    }

    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }
    formattedPhone = formattedPhone + '@s.whatsapp.net';

    try {
      const result = await this.sock.sendMessage(formattedPhone, { text: message });
      return { success: true, messageId: result.key.id };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendImage(phone, imagePath, caption = '') {
    if (!this.sock || !this.isConnected) {
      throw new Error('WhatsApp not connected');
    }

    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }
    formattedPhone = formattedPhone + '@s.whatsapp.net';

    try {
      const result = await this.sock.sendMessage(formattedPhone, {
        image: fs.readFileSync(imagePath),
        caption
      });
      return { success: true, messageId: result.key.id };
    } catch (error) {
      console.error('Send image error:', error);
      return { success: false, error: error.message };
    }
  }

  async disconnect() {
    if (this.sock) {
      this.sock.end('User disconnected');
      this.isConnected = false;
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      phone: this.phoneNumber,
      hasQR: !!this.qrCode,
      ready: this.connectionReady
    };
  }

  getQR() {
    return this.qrCode;
  }
}

// Factory function to get/create session
export function getWhatsAppSession(sessionId = 'default') {
  if (!whatsappSessions.has(sessionId)) {
    whatsappSessions.set(sessionId, new WhatsAppService(sessionId));
  }
  return whatsappSessions.get(sessionId);
}

export { whatsappSessions };
