import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const CarouselSchema = z.object({
  tour_id: z.number().int(),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  image_url: z.string().min(1).max(512),
  sort_order: z.number().int().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = searchParams.get('tour_id')
  const all = searchParams.get('all') === '1'

  if (!tourId) return NextResponse.json({ error: 'tour_id required' }, { status: 400 })

  try {
    const query = all
      ? 'SELECT * FROM itinerary_carousel WHERE tour_id = ? ORDER BY sort_order ASC'
      : 'SELECT * FROM itinerary_carousel WHERE tour_id = ? AND is_active = 1 ORDER BY sort_order ASC'
    const [rows] = await (pool as any).query(query, [Number(tourId)])
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch carousel' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CarouselSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { tour_id, name, description, image_url, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      'INSERT INTO itinerary_carousel (tour_id, name, description, image_url, sort_order) VALUES (?,?,?,?,?)',
      [tour_id, name, description, image_url, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create carousel item' }, { status: 500 })
  }
}