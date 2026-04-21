import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const TourUpdateSchema = z.object({
  tag: z.string().min(1).max(50).optional(),
  tag_color: z.string().min(1).max(50).optional(),
  title: z.string().min(1).max(255).optional(),
  type: z.string().min(1).max(50).optional(),
  days: z.number().int().min(1).optional(),
  description: z.string().min(1).optional(),
  flyer_description: z.string().optional().nullable(),
  price: z.string().min(1).max(50).optional(),
  image_url: z.string().min(1).max(512).optional(),
  flyer_image_url: z.string().max(512).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  province: z.string().max(255).optional().nullable(),
  coordinates: z.string().max(100).optional().nullable(),
  map_pin_x: z.number().min(0).max(100).optional(),
  map_pin_y: z.number().min(0).max(100).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    const [rows] = await (pool as any).query('SELECT * FROM tours WHERE id = ?', [id])
    const tour = (rows as any[])[0]
    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [highlights] = await (pool as any).query(
      'SELECT * FROM tour_highlights WHERE tour_id = ? ORDER BY sort_order ASC',
      [id]
    )

    return NextResponse.json({ ...tour, highlights })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = TourUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const fields = parsed.data
  const keys = Object.keys(fields)
  if (keys.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  const setClauses = keys.map(k => `${k} = ?`).join(', ')
  const values = keys.map(k => (fields as any)[k])

  try {
    await (pool as any).query(
      `UPDATE tours SET ${setClauses} WHERE id = ?`,
      [...values, id]
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    await (pool as any).query('DELETE FROM tour_highlights WHERE tour_id = ?', [id])
    await (pool as any).query('DELETE FROM tours WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 })
  }
}