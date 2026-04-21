import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const HeroUpdateSchema = z.object({
  image_url: z.string().min(1).max(512).optional(),
  label: z.string().max(255).optional().nullable(),
  is_active: z.number().int().min(0).max(1).optional(),
})

// GET — returns the single active hero row
export async function GET() {
  try {
    const [rows] = await (pool as any).query(
      'SELECT * FROM experience_hero WHERE is_active = 1 ORDER BY id DESC LIMIT 1'
    )
    const row = (rows as any[])[0]
    if (!row) return NextResponse.json({ error: 'No active hero found' }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 })
  }
}

// PUT — admin only, updates all hero rows or inserts a new one
export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = HeroUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { image_url, label } = parsed.data

  try {
    // Check if any hero row exists
    const [rows] = await (pool as any).query('SELECT id FROM experience_hero LIMIT 1')
    const existing = (rows as any[])[0]

    if (existing) {
      await (pool as any).query(
        'UPDATE experience_hero SET image_url = ?, label = ?, is_active = 1 WHERE id = ?',
        [image_url, label ?? null, existing.id]
      )
    } else {
      await (pool as any).query(
        'INSERT INTO experience_hero (image_url, label, is_active) VALUES (?, ?, 1)',
        [image_url, label ?? null]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 })
  }
}