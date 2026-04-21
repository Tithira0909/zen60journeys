import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

// GET /api/itinerary?tour_id=1 — public, returns all 4 sections
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tourId = Number(searchParams.get('tour_id'))
  if (isNaN(tourId) || tourId < 1) {
    return NextResponse.json({ error: 'tour_id required' }, { status: 400 })
  }

  try {
    const [heroRows] = await (pool as any).query(
      'SELECT * FROM itinerary_hero WHERE tour_id = ? LIMIT 1',
      [tourId]
    )
    const [days] = await (pool as any).query(
      'SELECT * FROM itinerary_days WHERE tour_id = ? ORDER BY sort_order ASC, day_number ASC',
      [tourId]
    )
    const [inclusions] = await (pool as any).query(
      'SELECT * FROM itinerary_inclusions WHERE tour_id = ? ORDER BY type ASC, sort_order ASC',
      [tourId]
    )
    const [carousel] = await (pool as any).query(
      'SELECT * FROM itinerary_carousel WHERE tour_id = ? AND is_active = 1 ORDER BY sort_order ASC',
      [tourId]
    )

    return NextResponse.json({
      hero: (heroRows as any[])[0] ?? null,
      days,
      inclusions,
      carousel,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 })
  }
}

// ── HERO ──
const HeroSchema = z.object({
  tour_id: z.number().int(),
  badge_text: z.string().max(100).optional(),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional().nullable(),
  duration_text: z.string().min(1).max(100),
  route_text: z.string().min(1).max(255),
  price_text: z.string().min(1).max(100),
  image_url: z.string().min(1).max(512),
  body_heading: z.string().min(1).max(255),
  body_text: z.string().min(1),
  stat_1_value: z.string().min(1).max(50),
  stat_1_label: z.string().min(1).max(100),
  stat_2_value: z.string().min(1).max(50),
  stat_2_label: z.string().min(1).max(100),
  stat_3_value: z.string().min(1).max(50),
  stat_3_label: z.string().min(1).max(100),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Detect which entity to create based on presence of key fields
  if ((body as any).tour_id && (body as any).title && (body as any).body_text !== undefined) {
    // Hero upsert
    const parsed = HeroSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    const d = parsed.data
    try {
      await (pool as any).query(
        `INSERT INTO itinerary_hero (tour_id, badge_text, title, subtitle, duration_text, route_text, price_text, image_url, body_heading, body_text, stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE badge_text=VALUES(badge_text), title=VALUES(title), subtitle=VALUES(subtitle), duration_text=VALUES(duration_text), route_text=VALUES(route_text), price_text=VALUES(price_text), image_url=VALUES(image_url), body_heading=VALUES(body_heading), body_text=VALUES(body_text), stat_1_value=VALUES(stat_1_value), stat_1_label=VALUES(stat_1_label), stat_2_value=VALUES(stat_2_value), stat_2_label=VALUES(stat_2_label), stat_3_value=VALUES(stat_3_value), stat_3_label=VALUES(stat_3_label)`,
        [d.tour_id, d.badge_text ?? 'Curated Journey', d.title, d.subtitle ?? null, d.duration_text, d.route_text, d.price_text, d.image_url, d.body_heading, d.body_text, d.stat_1_value, d.stat_1_label, d.stat_2_value, d.stat_2_label, d.stat_3_value, d.stat_3_label]
      )
      return NextResponse.json({ success: true })
    } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed to save hero' }, { status: 500 }) }
  }

  return NextResponse.json({ error: 'Unknown entity type' }, { status: 400 })
}