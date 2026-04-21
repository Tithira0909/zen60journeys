'use client'
import { useEffect, useState } from 'react'

interface Tour { id: number; title: string }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block',
}

export default function ItineraryHeroManager() {
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null)
  const [hero, setHero] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/tours').then(r => r.json()).then(data => setTours(Array.isArray(data) ? data : []))
  }, [])

  useEffect(() => {
    if (!selectedTourId) return
    fetch(`/api/itinerary?tour_id=${selectedTourId}`)
      .then(r => r.json())
      .then(data => {
        console.log('itinerary response:', data)
        setHero(data.hero ?? {
          tour_id: selectedTourId, badge_text: 'Curated Journey', title: '', subtitle: '',
          duration_text: '', route_text: '', price_text: '', image_url: '',
          body_heading: '', body_text: '',
          stat_1_value: '', stat_1_label: '', stat_2_value: '', stat_2_label: '', stat_3_value: '', stat_3_label: '',
        })
        setMsg('')
      })
  }, [selectedTourId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setHero(h => ({ ...h, image_url: data.url }))
    setUploading(false)
  }

  const save = async () => {
    if (!selectedTourId) return
    setSaving(true); setMsg('')
    const res = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...hero, tour_id: selectedTourId }),
    })
    setSaving(false)
    setMsg(res.ok ? 'Hero saved successfully.' : 'Error saving hero.')
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Itinerary Hero</h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Select Tour</label>
        <select style={{ ...inputStyle, maxWidth: '360px' }} value={selectedTourId ?? ''} onChange={e => setSelectedTourId(Number(e.target.value))}>
          <option value="">— Choose a tour —</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {!selectedTourId ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Select a tour above to edit its hero.</p>
      ) : (
        <>
          {msg && <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', backgroundColor: msg.startsWith('Error') ? '#fee2e2' : '#d1fae5', color: msg.startsWith('Error') ? '#991b1b' : '#065f46' }}>{msg}</div>}

          <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Badge Text</label><input style={inputStyle} value={hero.badge_text ?? ''} onChange={e => setHero(h => ({ ...h, badge_text: e.target.value }))} placeholder="Curated Journey" /></div>
              <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={hero.title ?? ''} onChange={e => setHero(h => ({ ...h, title: e.target.value }))} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Subtitle</label><input style={inputStyle} value={hero.subtitle ?? ''} onChange={e => setHero(h => ({ ...h, subtitle: e.target.value }))} /></div>
              <div><label style={labelStyle}>Duration Text</label><input style={inputStyle} value={hero.duration_text ?? ''} onChange={e => setHero(h => ({ ...h, duration_text: e.target.value }))} placeholder="7 Days · 6 Nights" /></div>
              <div><label style={labelStyle}>Route Text</label><input style={inputStyle} value={hero.route_text ?? ''} onChange={e => setHero(h => ({ ...h, route_text: e.target.value }))} placeholder="Colombo → Kandy → Ella" /></div>
              <div><label style={labelStyle}>Price Text</label><input style={inputStyle} value={hero.price_text ?? ''} onChange={e => setHero(h => ({ ...h, price_text: e.target.value }))} placeholder="From LKR 245,000" /></div>
              <div><label style={labelStyle}>Body Heading</label><input style={inputStyle} value={hero.body_heading ?? ''} onChange={e => setHero(h => ({ ...h, body_heading: e.target.value }))} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Body Text *</label><textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={hero.body_text ?? ''} onChange={e => setHero(h => ({ ...h, body_text: e.target.value }))} /></div>

              {/* Stats */}
              <div><label style={labelStyle}>Stat 1 Value</label><input style={inputStyle} value={hero.stat_1_value ?? ''} onChange={e => setHero(h => ({ ...h, stat_1_value: e.target.value }))} placeholder="3" /></div>
              <div><label style={labelStyle}>Stat 1 Label</label><input style={inputStyle} value={hero.stat_1_label ?? ''} onChange={e => setHero(h => ({ ...h, stat_1_label: e.target.value }))} placeholder="UNESCO Sites" /></div>
              <div><label style={labelStyle}>Stat 2 Value</label><input style={inputStyle} value={hero.stat_2_value ?? ''} onChange={e => setHero(h => ({ ...h, stat_2_value: e.target.value }))} placeholder="7" /></div>
              <div><label style={labelStyle}>Stat 2 Label</label><input style={inputStyle} value={hero.stat_2_label ?? ''} onChange={e => setHero(h => ({ ...h, stat_2_label: e.target.value }))} placeholder="Days" /></div>
              <div><label style={labelStyle}>Stat 3 Value</label><input style={inputStyle} value={hero.stat_3_value ?? ''} onChange={e => setHero(h => ({ ...h, stat_3_value: e.target.value }))} placeholder="12+" /></div>
              <div><label style={labelStyle}>Stat 3 Label</label><input style={inputStyle} value={hero.stat_3_label ?? ''} onChange={e => setHero(h => ({ ...h, stat_3_label: e.target.value }))} placeholder="Experiences" /></div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Hero Image</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={hero.image_url ?? ''} onChange={e => setHero(h => ({ ...h, image_url: e.target.value }))} placeholder="/images/cultural-triangle.JPG" />
                  <label style={{ cursor: 'pointer', padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '12px', backgroundColor: '#f9fafb', color: '#111827', whiteSpace: 'nowrap' }}>
                    {uploading ? 'Uploading...' : 'Upload'}<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                  </label>
                </div>
                {hero.image_url && <img src={hero.image_url} alt="preview" style={{ marginTop: '8px', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />}
              </div>
            </div>

            <button onClick={save} disabled={saving} style={{ marginTop: '20px', backgroundColor: '#111827', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Hero'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}