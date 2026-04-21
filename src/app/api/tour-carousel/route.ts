import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const CarouselSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.string().min(1).max(50),
  image_url: z.string().min(1).max(512),
  description: z.string().min(1).max(255),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all') === '1'

  try {
    const query = all
      ? 'SELECT * FROM tour_carousel ORDER BY sort_order ASC, id ASC'
      : 'SELECT * FROM tour_carousel WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    const [rows] = await (pool as any).query(query)
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
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { title, category, image_url, description, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      'INSERT INTO tour_carousel (title, category, image_url, description, sort_order) VALUES (?, ?, ?, ?, ?)',
      [title, category, image_url, description, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create carousel item' }, { status: 500 })
  }
}