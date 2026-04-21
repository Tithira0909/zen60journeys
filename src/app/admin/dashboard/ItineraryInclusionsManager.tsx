'use client'
import { useEffect, useState } from 'react'

interface Tour { id: number; title: string }
interface ItineraryInclusion {
  id: number; tour_id: number; type: 'included' | 'not_included';
  title: string; description: string; sort_order: number;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff', color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block',
}

export default function ItineraryInclusionsManager() {
  const [tours, setTours] = useState<Tour[]>([])
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null)
  const [inclusions, setInclusions] = useState<ItineraryInclusion[]>([])
  const [editing, setEditing] = useState<ItineraryInclusion | null>(null)
  const [form, setForm] = useState<Partial<ItineraryInclusion>>({})
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/tours').then(r => r.json()).then(data => setTours(Array.isArray(data) ? data : []))
  }, [])

  const load = (tourId: number) => {
    fetch(`/api/itinerary-inclusions?tour_id=${tourId}`)
      .then(r => r.json())
      .then(data => setInclusions(Array.isArray(data) ? data : []))
  }

  useEffect(() => { if (selectedTourId) { load(selectedTourId); setMsg('') } }, [selectedTourId])

  const openNew = (type: 'included' | 'not_included') => {
    setEditing(null)
    setForm({ tour_id: selectedTourId!, type, title: '', description: '', sort_order: 0 })
    setIsNew(true); setMsg('')
  }

  const openEdit = (item: ItineraryInclusion) => { setEditing(item); setForm({ ...item }); setIsNew(false); setMsg('') }
  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const save = async () => {
    setSaving(true); setMsg('')
    const payload = { ...form, tour_id: selectedTourId, sort_order: Number(form.sort_order) }
    const res = isNew
      ? await fetch('/api/itinerary-inclusions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/itinerary-inclusions/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Saved.'); cancel(); load(selectedTourId!) }
    else setMsg('Error saving.')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/itinerary-inclusions/${id}`, { method: 'DELETE' })
    load(selectedTourId!)
  }

  const included = inclusions.filter(i => i.type === 'included')
  const notIncluded = inclusions.filter(i => i.type === 'not_included')

  const ItemRow = ({ item }: { item: ItineraryInclusion }) => (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>{item.title}</p>
        <p style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
      </div>
      <button onClick={() => openEdit(item)} style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#dbeafe', color: '#111827', cursor: 'pointer', flexShrink: 0 }}>Edit</button>
      <button onClick={() => remove(item.id)} style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fff5f5', cursor: 'pointer', color: '#dc2626', flexShrink: 0 }}>Delete</button>
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Itinerary Inclusions</h2>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>Controls the "What's Included" and "Not Included" sections on the itinerary page. Each tour has its own set.</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Select Tour</label>
        <select style={{ ...inputStyle, maxWidth: '360px' }} value={selectedTourId ?? ''} onChange={e => setSelectedTourId(Number(e.target.value))}>
          <option value="">— Choose a tour —</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {!selectedTourId ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Select a tour above to manage its inclusions.</p>
      ) : (
        <>
          {msg && <div style={{ padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', backgroundColor: msg.startsWith('Error') ? '#fee2e2' : '#d1fae5', color: msg.startsWith('Error') ? '#991b1b' : '#065f46' }}>{msg}</div>}

          {(isNew || editing) && (
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>{isNew ? `New ${form.type === 'included' ? 'Included' : 'Not Included'} Item` : 'Edit Item'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={labelStyle}>Type</label>
                  <select style={inputStyle} value={form.type ?? 'included'} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                    <option value="included">Included</option>
                    <option value="not_included">Not Included</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Sort Order</label><input style={inputStyle} type="number" value={form.sort_order ?? 0} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description *</label><textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button onClick={save} disabled={saving} style={{ backgroundColor: '#111827', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={cancel} style={{ backgroundColor: 'transparent', color: '#6b7280', padding: '8px 20px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#065f46' }}>✓ Included ({included.length})</h3>
                <button onClick={() => openNew('included')} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '5px', border: '1px solid #065f46', backgroundColor: '#f0fdf4', cursor: 'pointer', color: '#065f46' }}>+ Add</button>
              </div>
              {included.length === 0 ? <p style={{ fontSize: '12px', color: '#9ca3af' }}>No items yet.</p> : included.map(i => <ItemRow key={i.id} item={i} />)}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b' }}>✕ Not Included ({notIncluded.length})</h3>
                <button onClick={() => openNew('not_included')} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '5px', border: '1px solid #991b1b', backgroundColor: '#fff5f5', cursor: 'pointer', color: '#991b1b' }}>+ Add</button>
              </div>
              {notIncluded.length === 0 ? <p style={{ fontSize: '12px', color: '#9ca3af' }}>No items yet.</p> : notIncluded.map(i => <ItemRow key={i.id} item={i} />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}