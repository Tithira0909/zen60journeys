// ============================================================
// src/app/api/itinerary-days/route.ts
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const DaySchema = z.object({
  tour_id: z.number().int(),
  day_number: z.number().int().min(1),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  tags: z.string().max(255).optional().nullable(),
  icon_name: z.string().max(50).optional(),
  map_label: z.string().max(255).optional().nullable(),
  weather_text: z.string().max(100).optional().nullable(),
  card_detail: z.string().optional().nullable(),
  duration_text: z.string().max(100).optional().nullable(),
  next_step_text: z.string().max(100).optional().nullable(),
  pin_x: z.number().min(0).max(100).optional(),
  pin_y: z.number().min(0).max(100).optional(),
  sort_order: z.number().int().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tour_id')
  if (!tourId) return NextResponse.json({ error: 'tour_id required' }, { status: 400 })
  try {
    const [rows] = await (pool as any).query(
      'SELECT * FROM itinerary_days WHERE tour_id = ? ORDER BY sort_order ASC, day_number ASC',
      [Number(tourId)]
    )
    return NextResponse.json(rows)
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req); if (authError) return authError
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = DaySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const d = parsed.data
  try {
    const [result] = await (pool as any).query(
      `INSERT INTO itinerary_days (tour_id, day_number, title, description, tags, icon_name, map_label, weather_text, card_detail, duration_text, next_step_text, pin_x, pin_y, sort_order)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [d.tour_id, d.day_number, d.title, d.description, d.tags ?? null, d.icon_name ?? 'MapPin', d.map_label ?? null, d.weather_text ?? null, d.card_detail ?? null, d.duration_text ?? null, d.next_step_text ?? null, d.pin_x ?? 50, d.pin_y ?? 50, d.sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed to create day' }, { status: 500 }) }
}