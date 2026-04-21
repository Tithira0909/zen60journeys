import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const HighlightSchema = z.object({
  number_label: z.string().max(10).optional(),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req)
  const isAdmin = !authError

  try {
    const [rows] = await (pool as any).query(
      isAdmin
        ? 'SELECT * FROM experience_highlights ORDER BY sort_order ASC, id ASC'
        : 'SELECT * FROM experience_highlights WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
    )
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

  const { number_label, title, description, sort_order } = parsed.data

  try {
    const [result] = await (pool as any).query(
      `INSERT INTO experience_highlights (number_label, title, description, sort_order)
       VALUES (?, ?, ?, ?)`,
      [number_label ?? '01', title, description, sort_order ?? 0]
    )
    return NextResponse.json({ id: (result as any).insertId }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 })
  }
}