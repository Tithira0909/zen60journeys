import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { NextRequest} from 'next/server'


export async function GET() {
  const [rows] = await db.query('SELECT * FROM tours_hero WHERE is_active = 1 LIMIT 1') as any
  return NextResponse.json(rows[0] ?? null)
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin(req)
  if (authError) return authError

  const body = await req.json()
  const { heading, subheading, image_url } = body

  const [rows] = await db.query('SELECT id FROM tours_hero LIMIT 1') as any
  if (rows.length === 0) {
    await db.query(
      'INSERT INTO tours_hero (heading, subheading, image_url) VALUES (?, ?, ?)',
      [heading, subheading, image_url]
    )
  } else {
    await db.query(
      'UPDATE tours_hero SET heading = ?, subheading = ?, image_url = ? WHERE id = ?',
      [heading, subheading, image_url, rows[0].id]
    )
  }
  return NextResponse.json({ ok: true })
}