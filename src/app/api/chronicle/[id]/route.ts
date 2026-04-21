// app/api/chronicle/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const CardUpdateSchema = z.object({
  category:   z.string().min(1).max(80).optional(),
  title:      z.string().min(1).max(120).optional(),
  tag:        z.string().min(1).max(80).optional(),
  image_url:  z.string().min(1).max(500).optional(),
  sort_order: z.number().int().min(0).optional(),
  // Accept both boolean and 0/1 since the frontend sends integers
  is_active:  z.union([z.boolean(), z.literal(0), z.literal(1)]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM chronicle_cards WHERE id = ?', [id]
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ card: rows[0] });
  } catch (err) {
    console.error('[GET /api/chronicle/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const parsed = CardUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const fields: string[] = [];
    const values: any[]    = [];

    if (d.category   !== undefined) { fields.push('category = ?');   values.push(d.category); }
    if (d.title      !== undefined) { fields.push('title = ?');      values.push(d.title); }
    if (d.tag        !== undefined) { fields.push('tag = ?');        values.push(d.tag); }
    if (d.image_url  !== undefined) { fields.push('image_url = ?');  values.push(d.image_url); }
    if (d.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(d.sort_order); }
    if (d.is_active  !== undefined) {
      fields.push('is_active = ?');
      // Normalise boolean | 0 | 1  →  0 | 1
      values.push(d.is_active ? 1 : 0);
    }

    if (!fields.length) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.execute(
      `UPDATE chronicle_cards SET ${fields.join(', ')} WHERE id = ?`, values
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/chronicle/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  try {
    await pool.execute(
      'DELETE FROM chronicle_cards WHERE id = ?', [id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/chronicle/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}