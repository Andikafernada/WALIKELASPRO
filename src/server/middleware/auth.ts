import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// ==========================================
// JWT_SECRET MANAGEMENT
// ==========================================

const ENV_PATH = path.join(process.cwd(), '.env');

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    if (fs.existsSync(ENV_PATH)) {
      const content = fs.readFileSync(ENV_PATH, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
          }
        }
      });
    }
  } catch (err) {
    console.error('Failed to load .env:', err);
  }
  return env;
}

function saveEnv(env: Record<string, string>): void {
  try {
    const entries = Object.entries(env).map(([key, value]) => `${key}=${value}`);
    fs.writeFileSync(ENV_PATH, entries.join('\n') + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to save .env:', err);
  }
}

function ensureJwtSecret(): string {
  const env = loadEnv();

  if (env.JWT_SECRET && env.JWT_SECRET.length >= 64) {
    return env.JWT_SECRET;
  }

  // Generate new secret
  const newSecret = crypto.randomBytes(64).toString('hex');
  env.JWT_SECRET = newSecret;
  saveEnv(env);
  console.log('✅ JWT_SECRET generated and saved to .env');
  return newSecret;
}

// Initialize JWT_SECRET
const JWT_SECRET = ensureJwtSecret();

// ==========================================
// TOKEN GENERATION
// ==========================================

const TOKEN_EXPIRY = '7d';

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// ==========================================
// PASSWORD HASHING
// ==========================================

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    return;
  }
}

// ==========================================
// TOKEN VERIFICATION (for public attendance)
// ==========================================

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}
