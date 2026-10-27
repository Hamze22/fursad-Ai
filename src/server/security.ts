// Load .env before reading any setting below (ES imports run before server.ts calls dotenv.config())
import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { Request, Response, NextFunction } from 'express';

const scrypt = promisify(crypto.scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export const IS_PROD = process.env.NODE_ENV === 'production';
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
fs.mkdirSync(DATA_DIR, { recursive: true });

/* ------------------------------------------------------------------ */
/* Session secret                                                      */
/* ------------------------------------------------------------------ */

let SECRET = process.env.SESSION_SECRET || '';
if (!SECRET) {
  if (IS_PROD) {
    throw new Error('SESSION_SECRET must be set in production (use a random string of 32+ characters).');
  }
  SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('[Security] SESSION_SECRET is not set. Using a temporary secret: everyone is logged out when the server restarts.');
}

const COOKIE_NAME = 'fursad_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* User store (JSON file, atomic writes)                               */
/* ------------------------------------------------------------------ */

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  salt: string;
  hash: string;
  createdAt: string;
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const users = new Map<string, StoredUser>(); // key = email

try {
  if (fs.existsSync(USERS_FILE)) {
    const list = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    if (Array.isArray(list)) for (const u of list) if (u?.email) users.set(u.email, u);
  }
} catch (err: any) {
  console.warn('[Security] Could not load users:', err.message);
}

export function atomicWriteJson(file: string, data: unknown) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, file);
}

function saveUsers() {
  atomicWriteJson(USERS_FILE, Array.from(users.values()));
}

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  credits: number;
  plan: 'free';
  courseProgress: number;
}

function toPublic(u: StoredUser): PublicUser {
  return { id: u.id, email: u.email, fullName: u.fullName, credits: 50, plan: 'free', courseProgress: 0 };
}

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

async function hashPassword(password: string, salt: Buffer) {
  return (await scrypt(password, salt, 64)).toString('hex');
}

// A fixed hash used so login takes the same time for unknown emails.
const DUMMY_SALT = crypto.randomBytes(16);

export async function registerUser(emailRaw: unknown, passwordRaw: unknown, nameRaw: unknown) {
  const email = String(emailRaw || '').trim().toLowerCase();
  const password = String(passwordRaw || '');
  const fullName = String(nameRaw || '').trim().slice(0, 80) || email.split('@')[0];

  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Enter a valid email address.');
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
  if (password.length > 128) throw new HttpError(400, 'Password is too long.');
  if (users.has(email)) throw new HttpError(409, 'An account with this email already exists.');

  const salt = crypto.randomBytes(16);
  const user: StoredUser = {
    id: 'u_' + crypto.randomBytes(9).toString('hex'),
    email,
    fullName,
    salt: salt.toString('hex'),
    hash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  users.set(email, user);
  saveUsers();
  return toPublic(user);
}

export async function loginUser(emailRaw: unknown, passwordRaw: unknown) {
  const email = String(emailRaw || '').trim().toLowerCase();
  const password = String(passwordRaw || '').slice(0, 128);
  const user = users.get(email);
  const salt = user ? Buffer.from(user.salt, 'hex') : DUMMY_SALT;
  const candidate = Buffer.from(await hashPassword(password, salt), 'hex');
  const stored = user ? Buffer.from(user.hash, 'hex') : Buffer.alloc(candidate.length);
  const ok = candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
  if (!user || !ok) throw new HttpError(401, 'Incorrect email or password.');
  return toPublic(user);
}

export function getUserById(id: string): PublicUser | null {
  for (const u of users.values()) if (u.id === id) return toPublic(u);
  return null;
}

/* ------------------------------------------------------------------ */
/* Signed session cookie                                               */
/* ------------------------------------------------------------------ */

function sign(payload: string) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function makeToken(uid: string) {
  const payload = Buffer.from(JSON.stringify({ uid, exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): string | null {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (typeof uid !== 'string' || typeof exp !== 'number' || exp < Date.now()) return null;
    return uid;
  } catch {
    return null;
  }
}

function parseCookies(header: string | undefined) {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function setSession(res: Response, uid: string) {
  const attrs = [
    `${COOKIE_NAME}=${makeToken(uid)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ];
  if (IS_PROD) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

export function clearSession(res: Response) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${IS_PROD ? '; Secure' : ''}`);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  const uid = token ? readToken(token) : null;
  if (!uid || !getUserById(uid)) {
    return res.status(401).json({ success: false, error: 'Please sign in to continue.' });
  }
  req.userId = uid;
  next();
}

/* ------------------------------------------------------------------ */
/* Rate limiting (in memory)                                           */
/* ------------------------------------------------------------------ */

interface Bucket { count: number; reset: number }

export function rateLimit(opts: { windowMs: number; max: number; by: 'user' | 'ip'; message?: string }) {
  const buckets = new Map<string, Bucket>();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  }, 60_000);
  timer.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = opts.by === 'user' ? (req.userId || req.ip || 'anon') : (req.ip || 'anon');
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || b.reset < now) {
      b = { count: 0, reset: now + opts.windowMs };
      buckets.set(key, b);
    }
    b.count++;
    if (b.count > opts.max) {
      res.setHeader('Retry-After', String(Math.ceil((b.reset - now) / 1000)));
      return res.status(429).json({
        success: false,
        error: opts.message || 'Too many requests. Please wait a moment and try again.',
      });
    }
    next();
  };
}

/* ------------------------------------------------------------------ */
/* Basic request hardening                                             */
/* ------------------------------------------------------------------ */

// Blocks cross-site state-changing requests (CSRF) by comparing Origin with Host.
export function sameOriginOnly(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return res.status(403).json({ success: false, error: 'Cross-site request blocked.' });
      }
    } catch {
      return res.status(403).json({ success: false, error: 'Invalid origin.' });
    }
  }
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
