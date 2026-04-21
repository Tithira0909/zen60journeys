'use client'
import { useEffect, useRef, useState } from 'react'
import { SRI_LANKA_LOCATIONS, latLonToPixelPct } from '@/lib/sriLankaLocations'

interface Tour { id: number; title: string }
interface ItineraryDay {
  id: number; tour_id: number; day_number: number; title: string; description: string;
  tags: string; icon_name: string; map_label: string; weather_text: string;
  card_detail: string; duration_text: string; next_step_text: string;
  lat: number; lon: number; pin_x: number; pin_y: number; sort_order: number;
}

const ICONS = ['MapPin', 'Plane', 'Ship', 'Train', 'Mountain', 'Camera', 'Heart', 'Sun', 'Leaf']

// Category dot colors for reference labels
const CATEGORY_COLOR: Record<string, string> = {
  City:     'rgba(255,255,255,0.80)',
  Cultural: 'rgba(255,200,100,0.85)',
  Nature:   'rgba(100,220,130,0.85)',
  Wildlife: 'rgba(255,160,80,0.85)',
  Beach:    'rgba(100,200,255,0.85)',
  Colombo:  'rgba(220,150,255,0.85)',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #d1d5db',
  borderRadius: '6px', fontSize: '13px', backgroundColor: '#fff',
  color: '#111827', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 600, color: '#6b7280',
  marginBottom: '4px', display: 'block',
}

// ── Click-to-place map pin ────────────────────────────────────────────────────
function MapPinPicker({
  pinX, pinY, lat, lon, dayTitle,
  onChange,
}: {
  pinX: number; pinY: number; lat: number; lon: number; dayTitle: string;
  onChange: (x: number, y: number, lat: number, lon: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [selectedLocation, setSelectedLocation] = useState('')

  const getPct = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mapRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top)  / rect.height) * 100))
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
    const { x, y } = latLonToPixelPct(loc.lat, loc.lon, 'itinerary')
    onChange(x, y, loc.lat, loc.lon)
  }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ ...labelStyle, marginBottom: '8px' }}>
        📍 Map Pin — pick a known location or click the map
      </label>

      {/* Quick-pick dropdown */}
      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Quick-pick a known location</label>
        <select style={{ ...inputStyle, maxWidth: '420px' }} value={selectedLocation} onChange={handleLocationSelect}>
          <option value="">— Select a location to snap pin —</option>
          {['City','Cultural','Nature','Wildlife','Beach','Colombo'].map(cat => (
            <optgroup key={cat} label={cat}>
              {SRI_LANKA_LOCATIONS.filter(l => l.category === cat).map(l => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Info strip */}
      <div style={{
        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px',
        padding: '8px 12px', fontSize: '11px', color: '#1d4ed8', marginBottom: '10px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span>🖱️</span>
        <span>
          Click the map for a custom spot, or enter lat/lon below for precision.
          Current: <strong>X: {pinX}%, Y: {pinY}%</strong>
          {lat ? ` · Lat: ${lat}, Lon: ${lon}` : ''}
        </span>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        onClick={handleClick}
        onMouseMove={e => { const p = getPct(e); setHoverPos(p) }}
        onMouseLeave={() => setHoverPos(null)}
        style={{
          position: 'relative', width: '100%', aspectRatio: '1/1',
          maxHeight: '460px', borderRadius: '10px', overflow: 'hidden',
          cursor: 'crosshair', border: '2px solid #e5e7eb',
          backgroundColor: '#f9f5f0', userSelect: 'none',
        }}
      >
        <img
          src="/images/itinerary-map.JPEG"
          alt="Sri Lanka map"
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />

        {/* Reference location dots */}
        {SRI_LANKA_LOCATIONS.map((loc) => {
          const { x, y } = latLonToPixelPct(loc.lat, loc.lon, 'itinerary')
          const color = CATEGORY_COLOR[loc.category] ?? 'rgba(255,255,255,0.7)'
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
                backgroundColor: color,
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }} />
              <span style={{
                fontSize: '7px', fontWeight: 700,
                color: 'rgba(60,40,20,0.9)',
                textShadow: '0 0 4px rgba(255,255,255,0.9), 0 1px 2px rgba(255,255,255,0.7)',
                whiteSpace: 'nowrap', lineHeight: 1,
              }}>
                {loc.name}
              </span>
            </div>
          )
        })}

        {/* Hover crosshair */}
        {hoverPos && (
          <div style={{
            position: 'absolute', left: `${hoverPos.x}%`, top: `${hoverPos.y}%`,
            transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 8,
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: '2px dashed rgba(0,0,0,0.5)', backgroundColor: 'rgba(0,0,0,0.08)',
            }} />
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
              fontSize: '9px', fontWeight: 600, padding: '2px 6px',
              borderRadius: '4px', whiteSpace: 'nowrap',
            }}>
              {hoverPos.x}%, {hoverPos.y}%
            </div>
          </div>
        )}

        {/* Active pin */}
        {pinX > 0 && pinY > 0 && (
          <div style={{
            position: 'absolute', left: `${pinX}%`, top: `${pinY}%`,
            transform: 'translate(-50%, -100%)', zIndex: 10, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              backgroundColor: '#FF8254', color: '#fff', fontSize: '9px', fontWeight: 700,
              padding: '3px 8px', borderRadius: '999px', marginBottom: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.35)', whiteSpace: 'nowrap',
              maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {dayTitle || 'Day pin'}
            </div>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: '#FF8254', border: '2.5px solid #fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <div style={{ width: '2px', height: '7px', backgroundColor: '#FF8254' }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#FF8254', opacity: 0.5 }} />
          </div>
        )}
      </div>

      {/* Fine-tune: lat/lon inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <div>
          <label style={labelStyle}>Latitude</label>
          <input style={inputStyle} type="number" step={0.0001} value={lat || ''}
            onChange={e => {
              const newLat = Number(e.target.value)
              const { x, y } = latLonToPixelPct(newLat, lon || 80.5, 'itinerary')
              onChange(x, y, newLat, lon)
            }}
            placeholder="e.g. 7.2936"
          />
        </div>
        <div>
          <label style={labelStyle}>Longitude</label>
          <input style={inputStyle} type="number" step={0.0001} value={lon || ''}
            onChange={e => {
              const newLon = Number(e.target.value)
              const { x, y } = latLonToPixelPct(lat || 7.5, newLon, 'itinerary')
              onChange(x, y, lat, newLon)
            }}
            placeholder="e.g. 80.6413"
          />
        </div>
        <div>
          <label style={labelStyle}>Pin X % <span style={{ color: '#9ca3af', fontWeight: 400 }}>(fine-tune)</span></label>
          <input style={inputStyle} type="number" min={0} max={100} step={0.5}
            value={pinX} onChange={e => onChange(Number(e.target.value), pinY, lat, lon)} />
        </div>
        <div>
          <label style={labelStyle}>Pin Y % <span style={{ color: '#9ca3af', fontWeight: 400 }}>(fine-tune)</span></label>
          <input style={inputStyle} type="number" min={0} max={100} step={0.5}
            value={pinY} onChange={e => onChange(pinX, Number(e.target.value), lat, lon)} />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ItineraryDaysManager() {
  const [tours, setTours]                   = useState<Tour[]>([])
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null)
  const [days, setDays]                     = useState<ItineraryDay[]>([])
  const [editing, setEditing]               = useState<ItineraryDay | null>(null)
  const [form, setForm]                     = useState<Partial<ItineraryDay>>({})
  const [isNew, setIsNew]                   = useState(false)
  const [saving, setSaving]                 = useState(false)
  const [msg, setMsg]                       = useState('')

  useEffect(() => {
    fetch('/api/tours').then(r => r.json()).then(data => setTours(Array.isArray(data) ? data : []))
  }, [])

  const loadDays = (tourId: number) => {
    fetch(`/api/itinerary-days?tour_id=${tourId}`)
      .then(r => r.json())
      .then(data => setDays(Array.isArray(data) ? data : []))
  }

  useEffect(() => {
    if (selectedTourId) { loadDays(selectedTourId); setMsg('') }
  }, [selectedTourId])

  const openNew = () => {
    setEditing(null)
    setForm({
      tour_id: selectedTourId!, day_number: days.length + 1,
      title: '', description: '', tags: '', icon_name: 'MapPin',
      map_label: '', weather_text: '', card_detail: '',
      duration_text: '', next_step_text: '',
      lat: 0, lon: 0, pin_x: 0, pin_y: 0,
      sort_order: days.length + 1,
    })
    setIsNew(true); setMsg('')
    setTimeout(() => document.getElementById('day-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const openEdit = (d: ItineraryDay) => {
    setEditing(d); setForm({ ...d }); setIsNew(false); setMsg('')
    setTimeout(() => document.getElementById('day-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const save = async () => {
    setSaving(true); setMsg('')
    const payload = {
      ...form,
      tour_id:    selectedTourId,
      lat:        Number(form.lat),
      lon:        Number(form.lon),
      pin_x:      Number(form.pin_x),
      pin_y:      Number(form.pin_y),
      day_number: Number(form.day_number),
      sort_order: Number(form.sort_order),
    }
    const res = isNew
      ? await fetch('/api/itinerary-days', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/itinerary-days/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Day saved.'); cancel(); loadDays(selectedTourId!) }
    else setMsg('Error saving day.')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this day? This cannot be undone.')) return
    await fetch(`/api/itinerary-days/${id}`, { method: 'DELETE' })
    loadDays(selectedTourId!)
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Itinerary Days & Map</h2>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>
          Each day appears in the sidebar timeline and as a pin on the Sri Lanka map.
          Pick a known location from the dropdown, click the map, or enter lat/lon directly —
          all three methods place the pin at the correct geographic position.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Select Tour</label>
        <select style={{ ...inputStyle, maxWidth: '360px' }} value={selectedTourId ?? ''} onChange={e => setSelectedTourId(Number(e.target.value))}>
          <option value="">— Choose a tour —</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>

      {!selectedTourId ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Select a tour above to manage its days.</p>
      ) : (
        <>
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
            <button onClick={openNew} style={{
              backgroundColor: '#111827', color: '#fff', padding: '8px 16px',
              borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>+ Add Day</button>
          </div>

          {(isNew || editing) && (
            <div id="day-form" style={{
              backgroundColor: '#fff', borderRadius: '10px', padding: '24px',
              marginBottom: '24px', border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>
                {isNew ? 'New Day' : `Editing Day ${editing?.day_number}`}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Day Number *</label>
                  <input style={inputStyle} type="number" min={1} value={form.day_number ?? ''}
                    onChange={e => setForm(f => ({ ...f, day_number: Number(e.target.value) }))} />
                </div>
                <div>
                  <label style={labelStyle}>Icon</label>
                  <select style={inputStyle} value={form.icon_name ?? 'MapPin'}
                    onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}>
                    {ICONS.map(ic => <option key={ic}>{ic}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} value={form.title ?? ''}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    value={form.description ?? ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>

                <div>
                  <label style={labelStyle}>Tags (comma-separated)</label>
                  <input style={inputStyle} value={form.tags ?? ''}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="Sightseeing,Culture,Temple" />
                </div>
                <div>
                  <label style={labelStyle}>Map Label</label>
                  <input style={inputStyle} value={form.map_label ?? ''}
                    onChange={e => setForm(f => ({ ...f, map_label: e.target.value }))}
                    placeholder="Sigiriya" />
                </div>
                <div>
                  <label style={labelStyle}>Weather Text</label>
                  <input style={inputStyle} value={form.weather_text ?? ''}
                    onChange={e => setForm(f => ({ ...f, weather_text: e.target.value }))}
                    placeholder="33°C · Sunny" />
                </div>
                <div>
                  <label style={labelStyle}>Duration Text</label>
                  <input style={inputStyle} value={form.duration_text ?? ''}
                    onChange={e => setForm(f => ({ ...f, duration_text: e.target.value }))}
                    placeholder="4–5 hrs" />
                </div>
                <div>
                  <label style={labelStyle}>Next Step</label>
                  <input style={inputStyle} value={form.next_step_text ?? ''}
                    onChange={e => setForm(f => ({ ...f, next_step_text: e.target.value }))}
                    placeholder="Drive to Kandy" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Card Detail</label>
                  <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                    value={form.card_detail ?? ''}
                    onChange={e => setForm(f => ({ ...f, card_detail: e.target.value }))} />
                </div>

                {/* ── Geographic pin picker ── */}
                <MapPinPicker
                  pinX={form.pin_x ?? 0}
                  pinY={form.pin_y ?? 0}
                  lat={form.lat ?? 0}
                  lon={form.lon ?? 0}
                  dayTitle={form.title ?? ''}
                  onChange={(x, y, lat, lon) =>
                    setForm(f => ({ ...f, pin_x: x, pin_y: y, lat, lon }))
                  }
                />

                <div>
                  <label style={labelStyle}>Sort Order</label>
                  <input style={inputStyle} type="number" value={form.sort_order ?? 0}
                    onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={save} disabled={saving} style={{
                  backgroundColor: '#111827', color: '#fff', padding: '8px 20px',
                  borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? 'Saving...' : 'Save Day'}
                </button>
                <button onClick={cancel} style={{
                  backgroundColor: 'transparent', color: '#6b7280', padding: '8px 20px',
                  borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {days.map(day => (
              <div key={day.id} style={{
                backgroundColor: '#fff', borderRadius: '8px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #e5e7eb',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  backgroundColor: '#111827', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, flexShrink: 0,
                }}>
                  {String(day.day_number).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{day.title}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {day.map_label || '—'} · Lat: {day.lat}, Lon: {day.lon} · Pin ({day.pin_x}%, {day.pin_y}%) · {day.icon_name}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(day)} style={{
                    fontSize: '11px', padding: '5px 12px', borderRadius: '5px',
                    border: '1px solid #d1d5db', backgroundColor: '#dbeafe', color: '#111827', cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => remove(day.id)} style={{
                    fontSize: '11px', padding: '5px 12px', borderRadius: '5px',
                    border: '1px solid #fecaca', backgroundColor: '#fff5f5', cursor: 'pointer', color: '#dc2626',
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}