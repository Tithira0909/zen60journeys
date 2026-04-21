import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const UpdateSchema = z.object({
  type: z.enum(['included', 'not_included']).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  sort_order: z.number().int().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req); if (authError) return authError
  const { id: rawId } = await params
  const id = Number(rawId); if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const fields = parsed.data; const keys = Object.keys(fields)
  if (!keys.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  const setClauses = keys.map(k => `${k} = ?`).join(', '); const values = keys.map(k => (fields as any)[k])
  try {
    await (pool as any).query(`UPDATE itinerary_inclusions SET ${setClauses} WHERE id = ?`, [...values, id])
    return NextResponse.json({ success: true })
  } catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req); if (authError) return authError
  const { id: rawId } = await params
  const id = Number(rawId); if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  try {
    await (pool as any).query('DELETE FROM itinerary_inclusions WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}