'use client'
import { useEffect, useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block',
}

export default function ToursHeroManager() {
  const [form, setForm] = useState({ heading: '', subheading: '', image_url: '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/tours-hero').then(r => r.json()).then(data => {
      if (data) setForm({ heading: data.heading, subheading: data.subheading, image_url: data.image_url })
    })
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, image_url: data.url }))
    setUploading(false)
  }

  const save = async () => {
    setSaving(true); setMsg('')
    const res = await fetch('/api/tours-hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setMsg(res.ok ? 'Hero banner saved.' : 'Error saving.')
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Tours Hero Banner</h2>

      {msg && (
        <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', backgroundColor: msg.startsWith('Error') ? '#fee2e2' : '#d1fae5', color: msg.startsWith('Error') ? '#991b1b' : '#065f46' }}>
          {msg}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Heading</label>
            <input style={inputStyle} value={form.heading} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} placeholder="Discover Sri Lanka" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Subheading</label>
            <input style={inputStyle} value={form.subheading} onChange={e => setForm(f => ({ ...f, subheading: e.target.value }))} placeholder="Curated journeys for every kind of traveller." />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Hero Image</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, flex: 1 }} value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="/images/tours-hero.jpg" />
              <label style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#111827', whiteSpace: 'nowrap' }}>
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
              </label>
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="Hero preview" style={{ marginTop: '10px', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
            )}
          </div>
        </div>

        <button onClick={save} disabled={saving} style={{ marginTop: '20px', backgroundColor: '#111827', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save Hero Banner'}
        </button>
      </div>
    </div>
  )
}