// app/api/chronicle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const CardSchema = z.object({
  category:   z.string().min(1).max(80),
  title:      z.string().min(1).max(120),
  tag:        z.string().min(1).max(80),
  image_url:  z.string().min(1).max(500),
  sort_order: z.number().int().min(0).default(0),
  // Accept boolean or 0/1 — frontend sends integers
  is_active:  z.union([z.boolean(), z.literal(0), z.literal(1)]).default(1),
});

export async function GET(req: NextRequest) {
  try {
    // Admin requests (with auth cookie) get ALL cards; public gets only active ones
    const authError = await requireAdmin(req);
    const isAdmin = !authError;

    const [rows] = await pool.execute(
      isAdmin
        ? `SELECT id, category, title, tag, image_url, sort_order, is_active
           FROM chronicle_cards
           ORDER BY sort_order ASC`
        : `SELECT id, category, title, tag, image_url, sort_order, is_active
           FROM chronicle_cards
           WHERE is_active = 1
           ORDER BY sort_order ASC`
    );
    return NextResponse.json({ cards: rows });
  } catch (err) {
    console.error('[GET /api/chronicle]', err);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = CardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const [result]: any = await pool.execute(
      `INSERT INTO chronicle_cards
         (category, title, tag, image_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.category, d.title, d.tag, d.image_url, d.sort_order, d.is_active ? 1 : 0]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/chronicle]', err);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}