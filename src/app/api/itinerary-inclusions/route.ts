// ============================================================
// src/app/api/itinerary-inclusions/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const InclusionSchema = z.object({
  tour_id: z.number().int(),
  type: z.enum(['included', 'not_included']),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  sort_order: z.number().int().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tour_id')
  if (!tourId) return NextResponse.json({ error: 'tour_id required' }, { status: 400 })
  try {
    const [rows] = await (pool as any).query(
      'SELECT * FROM itinerary_inclusions WHERE tour_id = ? ORDER BY type ASC, sort_order ASC',
      [Number(tourId)]
    )
    return NextResponse.json(rows)
  } catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req); if (authError) return authError
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = InclusionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const { tour_id, type, title, description, sort_order } = parsed.data
  try {
    const [result] = await (pool as any).query(
      'INSERT INTO itinerary_inclusions (tour_id, type, title, description, sort_order) VALUES (?,?,?,?,?)',
      [tour_id, type, title, description, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }) }
}


// ============================================================
// src/app/api/itinerary-inclusions/[id]/route.ts
// ============================================================
// (Copy just the PUT and DELETE handlers into that file)

export async function PUT_inclusion(req: NextRequest, id: number) {
  const authError = await requireAdmin(req); if (authError) return authError
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const schema = z.object({ type: z.enum(['included','not_included']).optional(), title: z.string().optional(), description: z.string().optional(), sort_order: z.number().int().optional() })
  const parsed = schema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const fields = parsed.data; const keys = Object.keys(fields); if (!keys.length) return NextResponse.json({ error: 'Nothing' }, { status: 400 })
  const setClauses = keys.map(k => `${k} = ?`).join(', '); const values = keys.map(k => (fields as any)[k])
  try { await (pool as any).query(`UPDATE itinerary_inclusions SET ${setClauses} WHERE id = ?`, [...values, id]); return NextResponse.json({ success: true }) }
  catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE_inclusion(req: NextRequest, id: number) {
  const authError = await requireAdmin(req); if (authError) return authError
  try { await (pool as any).query('DELETE FROM itinerary_inclusions WHERE id = ?', [id]); return NextResponse.json({ success: true }) }
  catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}


// ============================================================
// src/app/api/itinerary-carousel/route.ts
// ============================================================
const CarouselSchema = z.object({
  tour_id: z.number().int(),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  image_url: z.string().min(1).max(512),
  sort_order: z.number().int().optional(),
})

export async function GET_carousel(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tour_id')
  if (!tourId) return NextResponse.json({ error: 'tour_id required' }, { status: 400 })
  try {
    const [rows] = await (pool as any).query(
      'SELECT * FROM itinerary_carousel WHERE tour_id = ? AND is_active = 1 ORDER BY sort_order ASC',
      [Number(tourId)]
    )
    return NextResponse.json(rows)
  } catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST_carousel(req: NextRequest) {
  const authError = await requireAdmin(req); if (authError) return authError
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = CarouselSchema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const { tour_id, name, description, image_url, sort_order } = parsed.data
  try {
    const [result] = await (pool as any).query(
      'INSERT INTO itinerary_carousel (tour_id, name, description, image_url, sort_order) VALUES (?,?,?,?,?)',
      [tour_id, name, description, image_url, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) { return NextResponse.json({ error: 'Failed to create' }, { status: 500 }) }
}