import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const HighlightUpdateSchema = z.object({
  number_label: z.string().max(10).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  sort_order: z.number().int().optional(),
  is_active: z.union([z.boolean(), z.literal(0), z.literal(1)]).optional(),
})

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    const [rows] = await (pool as any).query('SELECT * FROM experience_highlights WHERE id = ?', [id])
    const row = (rows as any[])[0]
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = HighlightUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const fields = parsed.data
  const keys = Object.keys(fields)
  if (keys.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  const setClauses = keys.map(k => `${k} = ?`).join(', ')
  const values = keys.map(k => {
    const v = (fields as any)[k]
    if (k === 'is_active') return v ? 1 : 0
    return v
  })

  try {
    await (pool as any).query(
      `UPDATE experience_highlights SET ${setClauses} WHERE id = ?`,
      [...values, id]
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    await (pool as any).query('DELETE FROM experience_highlights WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}