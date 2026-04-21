'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface GalleryItem {
  id: number
  image_url: string
  alt_text: string
  object_position: string
  sort_order: number
  is_active: number
}

const emptyForm = { image_url: '', alt_text: '', object_position: 'center center', sort_order: 0 }

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isNew, setIsNew] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/experience-gallery?all=1')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(emptyForm); setIsNew(true); setMsg('') }
  const openEdit = (item: GalleryItem) => {
    setEditing(item)
    setForm({ image_url: item.image_url, alt_text: item.alt_text, object_position: item.object_position, sort_order: item.sort_order })
    setIsNew(false); setMsg('')
  }
  const cancel = () => { setEditing(null); setIsNew(false); setMsg('') }

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
    const payload = { ...form, sort_order: Number(form.sort_order) }
    const res = isNew
      ? await fetch('/api/experience-gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch(`/api/experience-gallery/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (res.ok) { setMsg('Saved.'); cancel(); load() }
    else { const err = await res.json(); setMsg('Error: ' + JSON.stringify(err.error)) }
  }

  const toggleActive = async (item: GalleryItem) => {
    await fetch(`/api/experience-gallery/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: item.is_active === 1 ? 0 : 1 }),
    })
    load()
  }

  const remove = async (item: GalleryItem) => {
    if (!confirm('Delete this gallery image? This cannot be undone.')) return
    await fetch(`/api/experience-gallery/${item.id}`, { method: 'DELETE' })
    load()
  }

  // ── Form view ──────────────────────────────────────────────────────────────
  if (isNew || editing) {
    return (
      <div className="w-full">
        <button
          onClick={cancel}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={15} />
          Back to gallery
        </button>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-5">
            {isNew ? 'New Gallery Image' : 'Edit Gallery Image'}
          </h3>

          {msg && (
            <div className={`px-4 py-2.5 rounded-lg mb-4 text-sm ${msg.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Text</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={form.alt_text}
                onChange={e => setForm(f => ({ ...f, alt_text: e.target.value }))}
                placeholder="Gallery Image"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Object Position</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={form.object_position}
                onChange={e => setForm(f => ({ ...f, object_position: e.target.value }))}
                placeholder="center center"
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

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Image</label>
              <div className="flex gap-2 items-center">
                <input
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="/images/gallery-1.JPG"
                />
                <label className="shrink-0 cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 transition whitespace-nowrap">
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-2 h-20 rounded-md object-cover" />
              )}
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
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-gray-900 truncate">
          Circular Gallery ({items.length})
        </h2>
        <button
          onClick={openNew}
          className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition border-none cursor-pointer"
        >
          + Add Image
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-2.5 rounded-lg mb-4 text-sm ${msg.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {msg}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-gray-400">No images yet — add one above.</p>
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {items.map(item => (
          <div
            key={item.id}
            className="rounded-lg overflow-hidden border border-gray-200 bg-white"
            style={{ opacity: item.is_active ? 1 : 0.45 }}
          >
            <img
              src={item.image_url}
              alt={item.alt_text}
              className="w-full block object-cover"
              style={{ height: '110px', objectPosition: item.object_position }}
            />
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-700 truncate mb-1">
                {item.alt_text || '—'}
              </p>
              <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-semibold mb-2 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.is_active ? 'Active' : 'Hidden'}
              </span>
              <p className="text-xs text-gray-400 mb-2">Order: {item.sort_order}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 text-xs py-1 rounded border border-gray-300 bg-gray-50 text-blue-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className={`flex-1 text-xs py-1 rounded border font-semibold transition cursor-pointer ${
                    item.is_active
                      ? 'border-gray-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'border-gray-300 bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {item.is_active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => remove(item)}
                  className="flex-1 text-xs py-1 rounded border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition cursor-pointer"
                >
                  Del
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}