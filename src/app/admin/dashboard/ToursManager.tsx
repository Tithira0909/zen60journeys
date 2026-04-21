'use client'

import { useEffect, useRef, useState } from 'react'
import { SRI_LANKA_LOCATIONS, latLonToPixelPct } from '@/lib/sriLankaLocations'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Tour {
  id:          number
  title:       string
  description: string
  location:    string
  lat:         number
  lon:         number
  map_pin_x:   number
  map_pin_y:   number
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff',
  color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280',
  marginBottom: '4px', display: 'block',
}

// ── Dark flyer map pin picker ─────────────────────────────────────────────────
function FlyerMapPinPicker({
  pinX, pinY, lat, lon, pinLabel,
  onChange,
}: {
  pinX: number; pinY: number; lat: number; lon: number; pinLabel: string
  onChange: (x: number, y: number, lat: number, lon: number) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)
  const [selectedLocation, setSelectedLocation] = useState('')

  const computedPin = (lat && lon && lat !== 0 && lon !== 0)
    ? latLonToPixelPct(lat, lon, 'flyer')
    : { x: pinX, y: pinY }

  const displayPinX = computedPin.x
  const displayPinY = computedPin.y

  const getPct = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mapRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left)  / rect.width)  * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top)   / rect.height) * 100))
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const pos = getPct(e)
    if (pos) onChange(pos.x, pos.y, lat, lon)
  }

  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value
    setSelectedLocation(name)
    if (!name) return
    const loc = SRI_LANKA_LOCATIONS.find(l => l.name === name)
    if (!loc) return
    const { x, y } = latLonToPixelPct(loc.lat, loc.lon, 'flyer')
    onChange(x, y, loc.lat, loc.lon)
  }

  const handleLatChange = (newLat: number) => {
    if (!newLat) return
    const { x, y } = latLonToPixelPct(newLat, lon || 80.5, 'flyer')
    onChange(x, y, newLat, lon)
  }

  const handleLonChange = (newLon: number) => {
    if (!newLon) return
    const { x, y } = latLonToPixelPct(lat || 7.5, newLon, 'flyer')
    onChange(x, y, lat, newLon)
  }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ ...labelStyle, marginBottom: '8px' }}>
        📍 Map Pin — pick a known location or click directly on the map
      </label>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Quick-pick a known location</label>
        <select
          style={{ ...inputStyle, maxWidth: '420px' }}
          value={selectedLocation}
          onChange={handleLocationSelect}
        >
          <option value="">— Select a location to snap pin —</option>
          {(['City', 'Cultural', 'Nature', 'Wildlife', 'Beach', 'Colombo'] as const).map(cat => (
            <optgroup key={cat} label={cat}>
              {SRI_LANKA_LOCATIONS.filter(l => l.category === cat).map(l => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div style={{
        backgroundColor: '#1a2e3a', border: '1px solid #2d4a5e',
        borderRadius: '6px', padding: '8px 12px', fontSize: '11px',
        color: '#7dd3fc', marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span>🖱️</span>
        <span>
          Click the map to place a custom pin, or use the dropdown / lat-lon inputs for precision.
          {displayPinX > 0
            ? <> Current: <strong>X {displayPinX}%, Y {displayPinY}%</strong>{lat ? ` · ${lat}°N, ${lon}°E` : ''}</>
            : ' No pin placed yet.'}
        </span>
      </div>

      <div
        ref={mapRef}
        onClick={handleClick}
        onMouseMove={e => { const p = getPct(e); setHover(p) }}
        onMouseLeave={() => setHover(null)}
        style={{
          position: 'relative', width: '100%', aspectRatio: '1 / 1',
          borderRadius: '10px', overflow: 'hidden',
          cursor: 'crosshair', border: '2px solid #374151',
          backgroundColor: '#0d1b1e', userSelect: 'none',
        }}
      >
        <img
          src="/images/flyer-map.JPEG"
          alt="Sri Lanka map"
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: 0.85, pointerEvents: 'none',
          }}
        />

        {SRI_LANKA_LOCATIONS.map(loc => {
          const { x, y } = latLonToPixelPct(loc.lat, loc.lon, 'flyer')
          return (
            <div
              key={loc.name}
              style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                pointerEvents: 'none', zIndex: 5,
              }}
            >
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
              }} />
              <span style={{
                fontSize: '7px', fontWeight: 700, lineHeight: 1,
                color: 'rgba(255,255,255,0.78)',
                textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
              }}>
                {loc.name}
              </span>
            </div>
          )
        })}

        {hover && (
          <div style={{
            position: 'absolute', left: `${hover.x}%`, top: `${hover.y}%`,
            transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 8,
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.55)',
              backgroundColor: 'rgba(255,255,255,0.08)',
            }} />
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.78)', color: '#fff',
              fontSize: '9px', fontWeight: 600,
              padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap',
            }}>
              {hover.x}%, {hover.y}%
            </div>
          </div>
        )}

        {displayPinX > 0 && displayPinY > 0 && (
          <div style={{
            position: 'absolute', left: `${displayPinX}%`, top: `${displayPinY}%`,
            transform: 'translate(-50%, -100%)',
            zIndex: 10, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              backgroundColor: '#FF8254', color: '#fff',
              fontSize: '9px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '999px', marginBottom: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap', maxWidth: '160px',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {pinLabel || 'Tour location'}
            </div>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: '#FF8254', border: '2.5px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <div style={{ width: '2px', height: '7px', backgroundColor: '#FF8254' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#FF8254', opacity: 0.5 }} />
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <div>
          <label style={labelStyle}>Latitude</label>
          <input
            style={inputStyle} type="number" step={0.0001}
            value={lat || ''} placeholder="e.g. 7.9495"
            onChange={e => handleLatChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label style={labelStyle}>Longitude</label>
          <input
            style={inputStyle} type="number" step={0.0001}
            value={lon || ''} placeholder="e.g. 80.7504"
            onChange={e => handleLonChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label style={labelStyle}>Pin X % <span style={{ color: '#9ca3af', fontWeight: 400 }}>(fine-tune)</span></label>
          <input
            style={inputStyle} type="number" min={0} max={100} step={0.5}
            value={displayPinX}
            onChange={e => onChange(Number(e.target.value), displayPinY, lat, lon)}
          />
        </div>
        <div>
          <label style={labelStyle}>Pin Y % <span style={{ color: '#9ca3af', fontWeight: 400 }}>(fine-tune)</span></label>
          <input
            style={inputStyle} type="number" min={0} max={100} step={0.5}
            value={displayPinY}
            onChange={e => onChange(displayPinX, Number(e.target.value), lat, lon)}
          />
        </div>
      </div>
    </div>
  )
}

// ── Main manager ──────────────────────────────────────────────────────────────
export default function ToursManager() {
  const [tours, setTours]     = useState<Tour[]>([])
  const [editing, setEditing] = useState<Tour | null>(null)
  const [form, setForm]       = useState<Partial<Tour>>({})
  const [isNew, setIsNew]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  const loadTours = () => {
    fetch('/api/tours?admin=1')
      .then(r => r.json())
      .then(data => setTours(Array.isArray(data) ? data : []))
  }

  useEffect(() => { loadTours() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ title: '', description: '', location: '', lat: 0, lon: 0, map_pin_x: 0, map_pin_y: 0 })
    setIsNew(true); setMsg('')
    setTimeout(() => document.getElementById('tour-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const openEdit = (t: Tour) => {
    setEditing(t); setForm({ ...t }); setIsNew(false); setMsg('')
    setTimeout(() => document.getElementById('tour-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const save = async () => {
    setSaving(true); setMsg('')
    const lat = Number(form.lat)
    const lon = Number(form.lon)
    const computed = (lat && lon) ? latLonToPixelPct(lat, lon, 'flyer') : null
    const payload = {
      ...form,
      lat,
      lon,
      map_pin_x: computed ? computed.x : Number(form.map_pin_x),
      map_pin_y: computed ? computed.y : Number(form.map_pin_y),
    }
    const res = isNew
      ? await fetch('/api/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/tours/${editing!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) { setMsg('Tour saved.'); cancel(); loadTours() }
    else setMsg('Error saving tour.')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this tour? This cannot be undone.')) return
    await fetch(`/api/tours/${id}`, { method: 'DELETE' })
    loadTours()
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Tours</h2>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>
          Each tour has a location pinned on the dark Sri Lanka map. When a user clicks "View Details",
          the flyer opens showing that tour's pin at the correct geographic position.
        </p>
      </div>

      {msg && (
        <div style={{
          padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px',
          backgroundColor: msg.startsWith('Error') ? '#fee2e2' : '#d1fae5',
          color: msg.startsWith('Error') ? '#991b1b' : '#065f46',
        }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={openNew}
          style={{
            backgroundColor: '#111827', color: '#fff', padding: '8px 16px',
            borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          + Add Tour
        </button>
      </div>

      {(isNew || editing) && (
        <div
          id="tour-form"
          style={{
            backgroundColor: '#fff', borderRadius: '10px', padding: '24px',
            marginBottom: '24px', border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>
            {isNew ? 'New Tour' : `Editing: ${editing?.title}`}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                value={form.title ?? ''}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                Location Name{' '}
                <span style={{ color: '#9ca3af', fontWeight: 400 }}>(label shown on the flyer card)</span>
              </label>
              <input
                style={inputStyle}
                value={form.location ?? ''}
                placeholder="e.g. Sigiriya, Ella, Kandy…"
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>

            <FlyerMapPinPicker
              pinX={form.map_pin_x ?? 0}
              pinY={form.map_pin_y ?? 0}
              lat={form.lat ?? 0}
              lon={form.lon ?? 0}
              pinLabel={form.location || form.title || ''}
              onChange={(x, y, lat, lon) =>
                setForm(f => ({ ...f, map_pin_x: x, map_pin_y: y, lat, lon }))
              }
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                backgroundColor: '#111827', color: '#fff', padding: '8px 20px',
                borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save Tour'}
            </button>
            <button
              onClick={cancel}
              style={{
                backgroundColor: 'transparent', color: '#6b7280', padding: '8px 20px',
                borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tours.map(tour => (
          <div
            key={tour.id}
            style={{
              backgroundColor: '#fff', borderRadius: '8px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{tour.title}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                {tour.location || '—'}
                {tour.lat ? ` · ${tour.lat}°N, ${tour.lon}°E` : ''}
                {tour.map_pin_x ? ` · Pin (${tour.map_pin_x}%, ${tour.map_pin_y}%)` : ''}
              </p>
              {tour.description && (
                <p style={{
                  fontSize: '12px', color: '#6b7280', marginTop: '3px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {tour.description}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => openEdit(tour)}
                style={{
                  fontSize: '11px', padding: '5px 12px', borderRadius: '5px',
                  border: '1px solid #d1d5db', backgroundColor: '#dbeafe', color: '#111827', cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => remove(tour.id)}
                style={{
                  fontSize: '11px', padding: '5px 12px', borderRadius: '5px',
                  border: '1px solid #fecaca', backgroundColor: '#fff5f5', cursor: 'pointer', color: '#dc2626',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}