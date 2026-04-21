'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Experience {
  id: number
  title: string
  subtitle: string | null
  description: string
  image_url: string
  category: string | null
  duration: string | null
  tag: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  category: 'General',
  duration: '',
  tag: 'Included with Festival Ticket',
  sort_order: 0,
}

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editing, setEditing] = useState<Experience | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [isNew, setIsNew] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const res = await fetch('/api/experiences')
    setExperiences(await res.json())
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsNew(true)
    setMsg('')
  }

  const openEdit = (exp: Experience) => {
    setEditing(exp)
    setForm({
      title: exp.title,
      subtitle: exp.subtitle ?? '',
      description: exp.description,
      image_url: exp.image_url,
      category: exp.category ?? 'General',
      duration: exp.duration ?? '',
      tag: exp.tag,
      sort_order: exp.sort_order,
    })
    setIsNew(false)
    setMsg('')
  }

  const cancel = () => {
    setEditing(null)
    setIsNew(false)
    setMsg('')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, image_url: data.url }))
    setUploading(false)
  }

  const save = async () => {
    setSaving(true)
    setMsg('')
    const payload = {
      ...form,
      sort_order: Number(form.sort_order),
      subtitle: form.subtitle || null,
      duration: form.duration || null,
    }
    const res = isNew
      ? await fetch('/api/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/experiences/${editing!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
    setSaving(false)
    if (res.ok) {
      setMsg('Saved successfully.')
      cancel()
      load()
    } else {
      const err = await res.json()
      setMsg('Error: ' + JSON.stringify(err.error))
    }
  }

  // Only sends is_active — no other fields that could fail validation
  const toggleActive = async (exp: Experience) => {
    await fetch(`/api/experiences/${exp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: exp.is_active === 1 ? 0 : 1 }),
    })
    load()
  }

  // Hard delete
  const remove = async (exp: Experience) => {
    if (!confirm(`Delete "${exp.title}"? This cannot be undone.`)) return
    await fetch(`/api/experiences/${exp.id}`, { method: 'DELETE' })
    load()
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border'
  const labelCls = 'block text-xs font-semibold text-gray-500 mb-1'

  // ── Edit / New form ───────────────────────────────────────────
  if (isNew || editing) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          {/* Back button */}
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
          >
            <ArrowLeft size={15} />
            Back to Signature Moments
          </button>

          <h3 className="text-sm font-bold text-gray-900 mb-5">
            {isNew ? 'New Signature Moment' : `Editing: ${editing?.title}`}
          </h3>

          {msg && (
            <div className={`px-4 py-2.5 rounded-md mb-4 text-sm ${
              msg.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea
                className={`${inputCls} min-h-[80px] resize-y`}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Tag</label>
              <select className={inputCls} value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                <option>Included with Festival Ticket</option>
                <option>Premium Add-On</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Duration</label>
              <input className={inputCls} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 6 hrs" />
            </div>

            <div>
              <label className={labelCls}>Sort Order</label>
              <input className={inputCls} type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Image</label>
              <div className="flex gap-2 items-center mb-2">
                <input
                  className={`${inputCls} flex-1`}
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="Paste URL or upload →"
                />
                {/* Upload button — identical pattern to ChronicleManager */}
                <label className="cursor-pointer shrink-0 inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg transition whitespace-nowrap">
                  {uploading ? 'Uploading...' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-1 h-28 w-full object-cover rounded-lg" />
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 sm:flex-none bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancel}
              className="flex-1 sm:flex-none px-5 py-2 rounded-md text-sm text-gray-500 border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Experience list ───────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-gray-900 truncate">
          Signature Moments ({experiences.length})
        </h2>
        <button
          onClick={openNew}
          className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition"
        >
          + Add Signature Moments
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-2.5 rounded-md mb-4 text-sm ${
          msg.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {experiences.map(exp => (
          <div
            key={exp.id}
            className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 transition ${exp.is_active ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="flex items-start gap-3">
              <img
                src={exp.image_url}
                alt={exp.title}
                className="w-14 h-10 sm:w-16 sm:h-11 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900 truncate">{exp.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                    exp.tag === 'Premium Add-On'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {exp.tag}
                  </span>
                  {/* Active / Hidden badge */}
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${
                    exp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {exp.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{exp.description}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => openEdit(exp)}
                className="text-xs px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(exp)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                  exp.is_active
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {exp.is_active ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => remove(exp)}
                className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-12">No experiences yet — add one above.</p>
        )}
      </div>
    </div>
  )
}