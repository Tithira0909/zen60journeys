import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const FlyerUpdateSchema = z.object({
  destination_id: z.union([z.number().int().min(1).max(8), z.null()]).optional(),
  title:          z.string().min(1).max(120).optional(),
  category:       z.string().min(1).max(80).optional(),
  location_text:  z.string().min(1).max(160).optional(),
  description:    z.string().min(1).optional(),
  image_url:      z.string().min(1).max(500).optional(),
  tag:            z.string().min(1).max(80).optional(),
  sort_order:     z.number().int().min(0).optional(),
  is_active:      z.union([z.boolean(), z.number()]).transform(v => v ? 1 : 0).optional(),
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
      'SELECT * FROM flyers WHERE id = ?', [id]
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ flyer: rows[0] });
  } catch (err) {
    console.error('[GET /api/flyers/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { id: rawId } = await params; // ✅ await here
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = FlyerUpdateSchema.safeParse(body);

    if (!parsed.success) {
      console.error('[PUT /api/flyers/[id]] Zod error:', JSON.stringify(parsed.error.flatten()));
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const fields: string[] = [];
    const values: any[]    = [];

    if (d.destination_id !== undefined) { fields.push('destination_id = ?'); values.push(d.destination_id); }
    if (d.title          !== undefined) { fields.push('title = ?');          values.push(d.title); }
    if (d.category       !== undefined) { fields.push('category = ?');       values.push(d.category); }
    if (d.location_text  !== undefined) { fields.push('location_text = ?');  values.push(d.location_text); }
    if (d.description    !== undefined) { fields.push('description = ?');    values.push(d.description); }
    if (d.image_url      !== undefined) { fields.push('image_url = ?');      values.push(d.image_url); }
    if (d.tag            !== undefined) { fields.push('tag = ?');            values.push(d.tag); }
    if (d.sort_order     !== undefined) { fields.push('sort_order = ?');     values.push(d.sort_order); }
    if (d.is_active      !== undefined) { fields.push('is_active = ?');      values.push(d.is_active); }

    if (!fields.length) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.execute(
      `UPDATE flyers SET ${fields.join(', ')} WHERE id = ?`, values
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/flyers/[id]]', err);
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
    await pool.execute('DELETE FROM flyers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/flyers/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}