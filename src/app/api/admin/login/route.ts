import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import pool from '@/lib/db';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; firstAttempt: number }>();

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for') ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count++;
  }
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const [rows]: any = await pool.query(
    'SELECT * FROM admin_users WHERE username = ?',
    [username]
  );

  const user = rows[0];

  if (!user) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  clearAttempts(ip);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ userId: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return res;
}