import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const DayUpdateSchema = z.object({
  day_number: z.number().int().min(1).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  tags: z.string().max(255).optional().nullable(),
  icon_name: z.string().max(50).optional(),
  map_label: z.string().max(255).optional().nullable(),
  weather_text: z.string().max(100).optional().nullable(),
  card_detail: z.string().optional().nullable(),
  duration_text: z.string().max(100).optional().nullable(),
  next_step_text: z.string().max(100).optional().nullable(),
  pin_x: z.number().min(0).max(100).optional(),
  pin_y: z.number().min(0).max(100).optional(),
  sort_order: z.number().int().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req); if (authError) return authError
  const { id: rawId } = await params
  const id = Number(rawId); if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  let body: unknown; try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = DayUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  const fields = parsed.data; const keys = Object.keys(fields)
  if (keys.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  const setClauses = keys.map(k => `${k} = ?`).join(', '); const values = keys.map(k => (fields as any)[k])
  try {
    await (pool as any).query(`UPDATE itinerary_days SET ${setClauses} WHERE id = ?`, [...values, id])
    return NextResponse.json({ success: true })
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed to update' }, { status: 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req); if (authError) return authError
  const { id: rawId } = await params
  const id = Number(rawId); if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  try {
    await (pool as any).query('DELETE FROM itinerary_days WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (err) { console.error(err); return NextResponse.json({ error: 'Failed to delete' }, { status: 500 }) }
}