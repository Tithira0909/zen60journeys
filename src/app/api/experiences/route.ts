import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const ExperienceSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().min(1),
  image_url: z.string().min(1).max(512),
  category: z.string().max(100).optional().nullable(),
  duration: z.string().max(100).optional().nullable(),
  price_from: z.string().max(100).optional().nullable(),
  tag: z.string().max(100).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

export async function GET() {
  try {
    const [rows] = await (pool as any).query(
      'SELECT * FROM experiences ORDER BY sort_order ASC, id ASC'
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ExperienceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { title, subtitle, description, image_url, category, duration, price_from, tag, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      `INSERT INTO experiences (title, subtitle, description, image_url, category, duration, price_from, tag, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, subtitle ?? null, description, image_url, category ?? 'General', duration ?? null, price_from ?? null, tag ?? 'Included with Festival Ticket', sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}