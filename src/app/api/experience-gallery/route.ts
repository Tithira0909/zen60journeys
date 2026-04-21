import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const GallerySchema = z.object({
  image_url: z.string().min(1).max(512),
  alt_text: z.string().max(255).optional().nullable(),
  object_position: z.string().max(50).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = GallerySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { image_url, alt_text, object_position, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      `INSERT INTO experience_gallery (image_url, alt_text, object_position, sort_order)
       VALUES (?, ?, ?, ?)`,
      [image_url, alt_text ?? 'Gallery Image', object_position ?? 'center center', sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  const isAdmin = !authError

  try {
    const [rows] = await (pool as any).query(
      isAdmin
        ? 'SELECT * FROM experience_gallery ORDER BY sort_order ASC, id ASC'
        : 'SELECT * FROM experience_gallery WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}