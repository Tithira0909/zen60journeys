'use client'
import { useEffect, useRef, useState } from 'react'

interface Tour { id: number; title: string }
interface CarouselItem {
  id: number; tour_id: number; name: string; description: string;
  image_url: string; sort_order: number; is_active: number;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block',
}

export default function ItineraryCarouselManager() {
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null)
  const [items, setItems] = useState<CarouselItem[]>([])
  const [editing, setEditing] = useState<CarouselItem | null>(null)
  const [form, setForm] = useState<Partial<CarouselItem>>({})
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/tours').then(r => r.json()).then(data => setTours(Array.isArray(data) ? data : []))
  }, [])

  const load = (tourId: number) => {
    fetch(`/api/itinerary-carousel?tour_id=${tourId}&all=1`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
  }

  useEffect(() => { if (selectedTourId) { load(selectedTourId); setMsg('') } }, [selectedTourId])

  const openNew = () => {
    setEditing(null)
    setForm({ tour_id: selectedTourId!, name: '', description: '', image_url: '', sort_order: items.length + 1 })
    setIsNew(true); setMsg('')
  }

  const openEdit = (item: CarouselItem) => { setEditing(item); setForm({ ...item }); setIsNew(false); setMsg('') }
  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMsg('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm(f => ({ ...f, image_url: data.url }))
      } else {
        setMsg('Error uploading image.')
      }
    } catch {
      setMsg('Error uploading image.')
    } finally {
      setUploading(false)
      // reset so same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const save = async () => {
    if (!form.name?.trim()) { setMsg('Name is required.'); return }
    if (!form.description?.trim()) { setMsg('Description is required.'); return }
    setSaving(true); setMsg('')
    const payload = { ...form, tour_id: selectedTourId, sort_order: Number(form.sort_order) }
    const res = isNew
      ? await fetch('/api/itinerary-carousel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/itinerary-carousel/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Saved.'); cancel(); load(selectedTourId!) }
    else setMsg('Error saving.')
  }

  const toggleActive = async (item: CarouselItem) => {
    await fetch(`/api/itinerary-carousel/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: item.is_active === 1 ? 0 : 1 }) })
    load(selectedTourId!)
  }

  const remove = async (item: CarouselItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    await fetch(`/api/itinerary-carousel/${item.id}`, { method: 'DELETE' })
    load(selectedTourId!)
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Itinerary Destinations</h2>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>Controls the expanding carousel at the bottom of each itinerary page. Each card expands on click to show destination info.</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Select Tour</label>
        <select style={{ ...inputStyle, maxWidth: '360px' }} value={selectedTourId ?? ''} onChange={e => setSelectedTourId(Number(e.target.value))}>
          <option value="">— Choose a tour —</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {!selectedTourId ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Select a tour above to manage its destination cards.</p>
      ) : (
        <>
          {msg && (
            <div style={{
              padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px',
              backgroundColor: msg.startsWith('Error') || msg.startsWith('Name') || msg.startsWith('Description') ? '#fee2e2' : '#d1fae5',
              color: msg.startsWith('Error') || msg.startsWith('Name') || msg.startsWith('Description') ? '#991b1b' : '#065f46',
            }}>{msg}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={openNew} style={{ backgroundColor: '#111827', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              + Add Destination
            </button>
          </div>

          {(isNew || editing) && (
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>
                {isNew ? 'New Destination' : `Editing: ${editing?.name}`}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Name */}
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    style={inputStyle}
                    value={form.name ?? ''}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Sigiriya"
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={form.sort_order ?? 0}
                    onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    value={form.description ?? ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>

                {/* Image URL + Upload */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Image</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      value={form.image_url ?? ''}
                      onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    />
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      backgroundColor: uploading ? '#f9fafb' : '#f3f4f6',
                      border: '1px solid #d1d5db', borderRadius: '6px',
                      padding: '7px 12px', fontSize: '12px', fontWeight: 600,
                      color: uploading ? '#9ca3af' : '#374151',
                      cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                    }}>
                      {uploading ? '⏳ Uploading...' : 'Upload'}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploading}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Image preview */}
                  {form.image_url && (
                    <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                      <img
                        src={form.image_url}
                        alt="preview"
                        style={{ height: '80px', borderRadius: '6px', objectFit: 'cover', display: 'block' }}
                      />
                      <button
                        onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                        title="Remove image"
                        style={{
                          position: 'absolute', top: '-6px', right: '-6px',
                          width: '18px', height: '18px', borderRadius: '50%',
                          backgroundColor: '#ef4444', color: '#fff', border: 'none',
                          fontSize: '10px', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                        }}
                      >✕</button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={save}
                  disabled={saving || uploading}
                  style={{
                    backgroundColor: '#111827', color: '#fff', padding: '8px 20px',
                    borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600,
                    cursor: saving || uploading ? 'not-allowed' : 'pointer',
                    opacity: saving || uploading ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancel}
                  style={{ backgroundColor: 'transparent', color: '#6b7280', padding: '8px 20px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Grid preview */}
          {items.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No destination cards yet. Add one above.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {items.map(item => (
                <div key={item.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#fff', opacity: item.is_active ? 1 : 0.45 }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
                    : <div style={{ width: '100%', height: '110px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>No image</span>
                      </div>
                  }
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{item.name}</p>
                    <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#dbeafe', color: '#111827', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => toggleActive(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: item.is_active ? '#fef9c3' : '#dcfce7', color: '#111827', cursor: 'pointer' }}>{item.is_active ? 'Hide' : 'Show'}</button>
                      <button onClick={() => remove(item)} style={{ flex: 1, fontSize: '10px', padding: '4px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fee2e2', cursor: 'pointer', color: '#111827' }}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}