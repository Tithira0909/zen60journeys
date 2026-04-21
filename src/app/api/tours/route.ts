import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const TourSchema = z.object({
  tag: z.string().min(1).max(50),
  tag_color: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  type: z.string().min(1).max(50),
  days: z.number().int().min(1),
  description: z.string().min(1),
  // Separate longer description shown in the detail flyer (optional — falls back to description)
  flyer_description: z.string().optional().nullable(),
  price: z.string().min(1).max(50),
  image_url: z.string().min(1).max(512),
  // Separate background image shown in the detail flyer (optional — falls back to image_url)
  flyer_image_url: z.string().max(512).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  province: z.string().max(255).optional().nullable(),
  coordinates: z.string().max(100).optional().nullable(),
  // Pin position on the Sri Lanka map in TourDetailFlyer (% from left / top)
  map_pin_x: z.number().min(0).max(100).optional(),
  map_pin_y: z.number().min(0).max(100).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

// GET — public, returns tours with their highlights joined
export async function GET(req: NextRequest) {
  try {
    const isAdmin = req.nextUrl.searchParams.get('admin') === '1'

    const [tours] = await (pool as any).query(
      isAdmin
        ? 'SELECT * FROM tours ORDER BY sort_order ASC, id ASC'
        : 'SELECT * FROM tours WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    )

    const [highlights] = await (pool as any).query(
      'SELECT * FROM tour_highlights ORDER BY tour_id ASC, sort_order ASC'
    )

    const toursWithHighlights = (tours as any[]).map(tour => ({
      ...tour,
      highlights: (highlights as any[]).filter(h => h.tour_id === tour.id),
    }))

    return NextResponse.json(toursWithHighlights)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = TourSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const {
    tag, tag_color, title, type, days, description, flyer_description,
    price, image_url, flyer_image_url,
    location, province, coordinates,
    map_pin_x, map_pin_y,
    sort_order,
  } = parsed.data

  try {
    const [result] = await (pool as any).query(
      `INSERT INTO tours
        (tag, tag_color, title, type, days, description, flyer_description,
         price, image_url, flyer_image_url,
         location, province, coordinates,
         map_pin_x, map_pin_y, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tag, tag_color, title, type, days, description, flyer_description ?? null,
        price, image_url, flyer_image_url ?? null,
        location ?? null, province ?? null, coordinates ?? null,
        map_pin_x ?? 50, map_pin_y ?? 50,
        sort_order ?? 0,
      ]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 })
  }
}