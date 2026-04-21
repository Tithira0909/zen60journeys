'use client'
import { useEffect, useState } from 'react'

interface Highlight {
  id: number
  number_label: string
  title: string
  description: string
  sort_order: number
  is_active: number
}

const emptyForm = { number_label: '01', title: '', description: '', sort_order: 0 }

export default function HighlightsManager() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [editing, setEditing] = useState<Highlight | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/experience-highlights')
    const data = await res.json()
    setHighlights(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(emptyForm); setIsNew(true); setMsg('') }
  const openEdit = (h: Highlight) => {
    setEditing(h)
    setForm({ number_label: h.number_label, title: h.title, description: h.description, sort_order: h.sort_order })
    setIsNew(false); setMsg('')
  }
  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

  const save = async () => {
    setSaving(true); setMsg('')
    const payload = { ...form, sort_order: Number(form.sort_order) }
    const res = isNew
      ? await fetch('/api/experience-highlights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/experience-highlights/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Saved.'); cancel(); load() }
    else { const err = await res.json(); setMsg('Error: ' + JSON.stringify(err.error)) }
  }

  const toggleActive = async (h: Highlight) => {
    await fetch(`/api/experience-highlights/${h.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: h.is_active === 1 ? 0 : 1 }) })
    load()
  }

  const remove = async (h: Highlight) => {
    if (!confirm(`Hide highlight "${h.title}"?`)) return
    await fetch(`/api/experience-highlights/${h.id}`, { method: 'DELETE' }); load()
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-gray-900 truncate">Experience Highlights</h2>
        <button
          onClick={openNew}
          className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition border-none cursor-pointer"
        >
          + Add Highlight
        </button>
      </div>

      {/* Status message */}
      {msg && (
        <div className={`px-4 py-2.5 rounded-lg mb-4 text-sm ${
          msg.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {msg}
        </div>
      )}

      {/* Edit / New form */}
      {(isNew || editing) && (
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-5">
            {isNew ? 'New Highlight' : `Editing: ${editing?.title}`}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Number Label</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={form.number_label}
                onChange={e => setForm(f => ({ ...f, number_label: e.target.value }))}
                placeholder="01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Sort Order</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ocean Stage Sunset Ritual"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border resize-y"
                style={{ minHeight: '90px' }}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 sm:flex-none bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-60 border-none cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancel}
              className="flex-1 sm:flex-none bg-transparent text-gray-500 px-5 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Highlights list */}
      <div className="flex flex-col gap-3">
        {highlights.map(h => (
          <div
            key={h.id}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
            style={{ opacity: h.is_active ? 1 : 0.5 }}
          >
            {/* Top row: number + content */}
            <div className="flex items-start gap-4 mb-3">
              <span className="shrink-0 text-2xl font-light leading-none" style={{ color: 'rgba(217,119,6,0.5)' }}>
                {h.number_label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-1">{h.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{h.description}</p>
              </div>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden sm:block flex-1" />
              <button
                onClick={() => openEdit(h)}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 text-blue-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(h)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition cursor-pointer ${
                  h.is_active
                    ? 'border-gray-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    : 'border-gray-300 bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {h.is_active ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => remove(h)}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
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