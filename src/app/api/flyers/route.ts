import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const FlyerSchema = z.object({
  destination_id: z.union([z.number().int().min(1).max(8), z.null()]).optional().default(null),
  title:          z.string().min(1).max(120),
  category:       z.string().min(1).max(80),
  location_text:  z.string().min(1).max(160),
  description:    z.string().min(1),
  image_url:      z.string().min(1).max(500),
  tag:            z.string().min(1).max(80),
  is_active:      z.union([z.boolean(), z.number()]).transform(v => v ? 1 : 0).default(1),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    const [rows] = await pool.execute(
      showAll
        ? `SELECT id, destination_id, title, category, location_text,
                  description, image_url, tag, sort_order, is_active
           FROM flyers
           ORDER BY sort_order ASC`
        : `SELECT id, destination_id, title, category, location_text,
                  description, image_url, tag, sort_order, is_active
           FROM flyers
           WHERE is_active = 1
           ORDER BY sort_order ASC`
    );
    return NextResponse.json({ flyers: rows });
  } catch (err) {
    console.error('[GET /api/flyers]', err);
    return NextResponse.json({ error: 'Failed to fetch flyers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    console.log('[POST /api/flyers] body:', JSON.stringify(body));

    const parsed = FlyerSchema.safeParse(body);

    if (!parsed.success) {
      console.error('[POST /api/flyers] Zod error:', JSON.stringify(parsed.error.flatten()));
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;

    const [maxRows]: any = await pool.execute(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM flyers'
    );
    const nextOrder = (maxRows[0]?.max_order ?? -1) + 1;

    const [result]: any = await pool.execute(
      `INSERT INTO flyers
         (destination_id, title, category, location_text, description,
          image_url, tag, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.destination_id, d.title, d.category, d.location_text,
        d.description, d.image_url, d.tag, nextOrder, d.is_active,
      ]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/flyers]', err);
    return NextResponse.json({ error: 'Failed to create flyer' }, { status: 500 });
  }
}