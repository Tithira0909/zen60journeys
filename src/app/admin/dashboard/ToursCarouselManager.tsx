'use client'
import { useEffect, useRef, useState } from 'react'

interface CarouselItem {
  id: number
  title: string
  category: string
  image_url: string
  description: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  title: '', category: 'SCENIC', image_url: '', description: '', sort_order: 0,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block',
}

export default function TourCarouselManager() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [editing, setEditing] = useState<CarouselItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const res = await fetch('/api/tour-carousel?all=1')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(emptyForm); setIsNew(true); setMsg('') }
  const openEdit = (item: CarouselItem) => {
    setEditing(item)
    setForm({ title: item.title, category: item.category, image_url: item.image_url, description: item.description, sort_order: item.sort_order })
    setIsNew(false); setMsg('')
  }
  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMsg('Error: Please select a valid image file.')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMsg('Error: Image must be smaller than 5MB.')
      return
    }

    setUploading(true)
    setMsg('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        // Adjust the key below to match your upload API's response shape
        const url = data.url ?? data.path ?? data.image_url ?? ''
        setForm(f => ({ ...f, image_url: url }))
      } else {
        const err = await res.json().catch(() => ({}))
        setMsg('Error: ' + (err.error ?? 'Upload failed'))
      }
    } catch {
      setMsg('Error: Upload failed. Please enter the URL manually.')
    } finally {
      setUploading(false)
      // Reset the input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const save = async () => {
    setSaving(true); setMsg('')
    const payload = { ...form, sort_order: Number(form.sort_order) }
    const res = isNew
      ? await fetch('/api/tour-carousel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/tour-carousel/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Saved.'); cancel(); load() }
    else { const err = await res.json(); setMsg('Error: ' + JSON.stringify(err.error)) }
  }

  const toggle = async (item: CarouselItem) => {
    await fetch(`/api/tour-carousel/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: item.is_active === 1 ? 0 : 1 }) })
    load()
  }

  const remove = async (item: CarouselItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return
    await fetch(`/api/tour-carousel/${item.id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Experience Carousel</h2>
        <button onClick={openNew} style={{ backgroundColor: '#111827', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Add Item</button>
      </div>

      {msg && <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', backgroundColor: msg.startsWith('Error') ? '#fee2e2' : '#d1fae5', color: msg.startsWith('Error') ? '#991b1b' : '#065f46' }}>{msg}</div>}

      {(isNew || editing) && (
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>{isNew ? 'New Carousel Item' : 'Edit Carousel Item'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['SCENIC', 'ADVENTURE', 'CULTURAL', 'WELLNESS', 'LUXURY'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><label style={labelStyle}>Sort Order</label><input style={inputStyle} type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} /></div>

            {/* ── Image field with upload button ── */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Image</label>

              {/* Hidden native file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />

              {/* URL input + Upload button side by side */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: '6px',
                    border: '1px solid #d1d5db', backgroundColor: '#f9fafb',
                    fontSize: '12px', fontWeight: 600, color: '#374151',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {/* Upload icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>

              {/* Live preview */}
              {form.image_url && (
                <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={{ height: '90px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                    title="Clear image"
                    style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      backgroundColor: '#ef4444', border: 'none', color: '#fff',
                      fontSize: '11px', cursor: 'pointer', lineHeight: '18px', textAlign: 'center', padding: 0,
                    }}
                  >×</button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} style={{ backgroundColor: '#111827', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={cancel} style={{ backgroundColor: 'transparent', color: '#6b7280', padding: '8px 20px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {items.map(item => (
          <div key={item.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#fff', opacity: item.is_active ? 1 : 0.45 }}>
            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '8px 10px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{item.title}</p>
              <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px' }}>{item.category}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#dbeafe', color: '#111827', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => toggle(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: item.is_active ? '#fef9c3' : '#dcfce7', color: '#111827', cursor: 'pointer' }}>{item.is_active ? 'Hide' : 'Show'}</button>
                <button onClick={() => remove(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fee2e2', cursor: 'pointer', color: '#111827' }}>Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}