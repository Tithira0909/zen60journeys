'use client'
import { useEffect, useState } from 'react'

export default function HeroManager() {
  const [imageUrl, setImageUrl] = useState('')
  const [label, setLabel] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/experience-hero')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) { setImageUrl(data.image_url); setLabel(data.label ?? '') }
      })
      .catch(() => {})
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setImageUrl(data.url)
    setUploading(false)
  }

  const save = async () => {
    if (!imageUrl.trim()) { setMsg('Image URL is required.'); return }
    setSaving(true); setMsg('')
    const res = await fetch('/api/experience-hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, label: label || null }),
    })
    setSaving(false)
    if (res.ok) setMsg('Hero image updated successfully.')
    else { const err = await res.json(); setMsg('Error: ' + JSON.stringify(err.error)) }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">Experiences Hero</h2>
        <p className="text-xs text-gray-500 mt-1">
          Controls the full-screen background image on the /experiences page hero section.
        </p>
      </div>

      {/* Status message */}
      {msg && (
        <div className={`px-4 py-2.5 rounded-lg mb-4 text-sm ${
          msg.startsWith('Error')
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        {/* Preview */}
        {imageUrl && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 mb-2">Current Hero Image</p>
            <div className="relative rounded-xl overflow-hidden h-44 sm:h-52">
              <img
                src={imageUrl}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end p-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
                <span className="text-xs text-white/70 uppercase tracking-widest">Live Preview</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Image URL + Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="/images/experience-hero.JPG"
              />
              <label className="shrink-0 cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-blue-700 transition whitespace-nowrap">
                {uploading ? 'Uploading...' : 'Upload New'}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Label
              <span className="block sm:inline sm:ml-1 font-normal text-gray-400">(internal note, not shown on page)</span>
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 box-border"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Main Hero"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="mt-5 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60 border-none cursor-pointer"
        >
          {saving ? 'Saving...' : 'Update Hero Image'}
        </button>
      </div>
    </div>
  )
}