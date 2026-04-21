import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const ExperienceUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().min(1).optional(),
  image_url: z.string().min(1).max(512).optional(),
  category: z.string().max(100).optional().nullable(),
  duration: z.string().max(100).optional().nullable(),
  tag: z.string().max(100).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  try {
    const [rows] = await (pool as any).query('SELECT * FROM experiences WHERE id = ?', [id])
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

  const parsed = ExperienceUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const fields = parsed.data
  const keys = Object.keys(fields)
  if (keys.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  const setClauses = keys.map(k => `${k} = ?`).join(', ')
  const values = keys.map(k => (fields as any)[k])

  try {
    await (pool as any).query(
      `UPDATE experiences SET ${setClauses} WHERE id = ?`,
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
    await (pool as any).query('DELETE FROM experiences WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}