import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXTS  = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const UPLOAD_DIR    = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file     = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP and GIF images are allowed' },
        { status: 400 }
      );
    }

    const originalExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTS.has(originalExt)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large — maximum is 5 MB' },
        { status: 400 }
      );
    }

    const safeName   = `${randomBytes(16).toString('hex')}${originalExt}`;
    const targetPath = path.join(UPLOAD_DIR, safeName);

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}