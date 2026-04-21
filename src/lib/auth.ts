// lib/auth.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const token = req.cookies.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return null; // null = auth passed, continue
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}