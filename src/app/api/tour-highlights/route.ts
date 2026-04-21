import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const HighlightSchema = z.object({
  tour_id: z.number().int(),
  icon_name: z.string().min(1).max(50),
  text: z.string().min(1).max(255),
  sort_order: z.number().int().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tour_id')

  try {
    const query = tourId
      ? 'SELECT * FROM tour_highlights WHERE tour_id = ? ORDER BY sort_order ASC'
      : 'SELECT * FROM tour_highlights ORDER BY tour_id ASC, sort_order ASC'
    const params = tourId ? [Number(tourId)] : []
    const [rows] = await (pool as any).query(query, params)
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch highlights' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = HighlightSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { tour_id, icon_name, text, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      'INSERT INTO tour_highlights (tour_id, icon_name, text, sort_order) VALUES (?, ?, ?, ?)',
      [tour_id, icon_name, text, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 })
  }
}