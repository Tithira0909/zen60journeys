'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react'

interface Flyer {
  id?: number;
  destination_id: number | null;
  title: string;
  category: string;
  location_text: string;
  description: string;
  image_url: string;
  tag: string;
  sort_order: number;
  is_active: number;
}

const empty: Flyer = {
  destination_id: null,
  title: '',
  category: '',
  location_text: '',
  description: '',
  image_url: '',
  tag: '',
  sort_order: 0,
  is_active: 1,
};

export default function FlyersManager() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [editing, setEditing] = useState<Flyer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchFlyers(); }, []);

  async function fetchFlyers() {
    const res = await fetch('/api/flyers?all=true');
    const data = await res.json();
    setFlyers(data.flyers);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.url) setEditing({ ...editing, image_url: data.url });
    setUploading(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError('');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/flyers' : `/api/flyers/${editing.id}`;

    const payload = isNew
      ? (({ sort_order, ...rest }) => rest)(editing)
      : editing;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditing(null);
      setIsNew(false);
      fetchFlyers();
    } else {
      const data = await res.json();
      setError(data.error || 'Save failed');
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this flyer?')) return;
    await fetch(`/api/flyers/${id}`, { method: 'DELETE' });
    fetchFlyers();
  }

  async function toggleActive(flyer: Flyer) {
    await fetch(`/api/flyers/${flyer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...flyer, is_active: flyer.is_active ? 0 : 1 }),
    });
    fetchFlyers();
  }

  if (editing) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => { setEditing(null); setIsNew(false); setError(''); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={15} />
          Back to flyers
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {isNew ? 'New Flyer' : 'Edit Flyer'}
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Title', key: 'title', placeholder: 'e.g. Sunset Yoga & Sound Bath' },
            { label: 'Category', key: 'category', placeholder: 'e.g. Wellness · Mindfulness' },
            { label: 'Location', key: 'location_text', placeholder: 'e.g. Galle Fort, Southern Coast' },
            { label: 'Description', key: 'description', placeholder: 'A short description of this experience or event...' },
            { label: 'Tag', key: 'tag', placeholder: 'e.g. Reserve Your Spot Today' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              {key === 'description' ? (
                <textarea
                  value={(editing as any)[key]}
                  onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                  rows={3}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              ) : (
                <input
                  type="text"
                  value={(editing as any)[key]}
                  onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination ID
              <span className="block sm:inline sm:ml-2 text-xs text-gray-400 font-normal">
                Links to a map pin (1–8), optional
              </span>
            </label>
            <input
              type="number"
              value={editing.destination_id ?? ''}
              onChange={e => setEditing({ ...editing, destination_id: e.target.value ? Number(e.target.value) : null })}
              placeholder="Leave blank if not linked to a map pin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {!isNew && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
                <span className="block sm:inline sm:ml-2 text-xs text-gray-400 font-normal">
                  Lower = shown first. New flyers are added to the end automatically.
                </span>
              </label>
              <input
                type="number"
                value={editing.sort_order}
                onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                placeholder="e.g. 0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            {editing.image_url && (
              <img src={editing.image_url} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            <input
              type="text"
              value={editing.image_url}
              onChange={e => setEditing({ ...editing, image_url: e.target.value })}
              placeholder="Paste an image URL or upload below"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 mb-2"
            />
            <label className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition">
              {uploading ? 'Uploading...' : 'Upload image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(null); setIsNew(false); setError(''); }}
              className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          Flyers ({flyers.length})
        </h2>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true); }}
          className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          + New flyer
        </button>
      </div>

      <div className="space-y-3">
        {flyers.map(flyer => (
          <div key={flyer.id} className="bg-white rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-4 mb-3">
              {flyer.image_url ? (
                <img
                  src={flyer.image_url}
                  alt={flyer.title}
                  className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg shrink-0 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                  No image
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{flyer.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{flyer.category} · {flyer.location_text}</p>
                <p className="text-xs text-gray-400 mt-0.5">Order: {flyer.sort_order}</p>
              </div>
              <span className={`hidden sm:inline-flex shrink-0 items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                flyer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
              }`}>
                {flyer.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`sm:hidden text-xs px-2.5 py-1 rounded-full font-medium ${
                flyer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
              }`}>
                {flyer.is_active ? 'Active' : 'Hidden'}
              </span>

              <div className="hidden sm:block flex-1" />

              <button
                onClick={() => toggleActive(flyer)}
                className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {flyer.is_active ? 'Hide' : 'Unhide'}
              </button>
              <button
                onClick={() => { setEditing({ ...flyer }); setIsNew(false); }}
                className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(flyer.id!)}
                className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}