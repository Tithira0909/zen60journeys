'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Card {
  id?: number;
  category: string;
  title: string;
  tag: string;
  image_url: string;
  sort_order: number;
  is_active: number;
}

const empty: Card = {
  category: '',
  title: '',
  tag: '',
  image_url: '',
  sort_order: 0,
  is_active: 1,
};

export default function ChronicleManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [editing, setEditing] = useState<Card | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchCards(); }, []);

  async function fetchCards() {
    const res = await fetch('/api/chronicle');
    const data = await res.json();
    setCards(data.cards ?? []);
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
    const url = isNew ? '/api/chronicle' : `/api/chronicle/${editing.id}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setEditing(null);
      setIsNew(false);
      fetchCards();
    } else {
      const data = await res.json();
      setError(data.error || 'Save failed');
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this card? This cannot be undone.')) return;
    await fetch(`/api/chronicle/${id}`, { method: 'DELETE' });
    fetchCards();
  }

  async function toggleActive(card: Card) {
    await fetch(`/api/chronicle/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: card.is_active ? 0 : 1 }),
    });
    fetchCards();
  }

  function cancelEdit() {
    setEditing(null);
    setIsNew(false);
    setError('');
  }

  // ── Edit / New form ───────────────────────────────────────────
  if (editing) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={cancelEdit}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft size={15} />
          Back to cards
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {isNew ? 'New Card' : 'Edit Card'}
        </h2>

        <div className="space-y-4">
          {([
            ['Category', 'category'],
            ['Title', 'title'],
            ['Tag', 'tag'],
          ] as const).map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={(editing as any)[key]}
                onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              value={editing.sort_order}
              onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            {editing.image_url && (
              <img src={editing.image_url} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            <input
              type="text"
              value={editing.image_url}
              onChange={e => setEditing({ ...editing, image_url: e.target.value })}
              placeholder="Paste URL or upload below"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-gray-300 mb-2"
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
              onClick={cancelEdit}
              className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Card list ─────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          Chronicle Cards ({cards.length})
        </h2>
        <button
          onClick={() => { setEditing({ ...empty }); setIsNew(true); }}
          className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          + New card
        </button>
      </div>

      <div className="space-y-3">
        {cards.map(card => (
          <div key={card.id} className="bg-white rounded-xl p-4 sm:p-5">
            {/* Top row: image + meta */}
            <div className="flex items-start gap-4 mb-3 sm:mb-0">
              <img
                src={card.image_url}
                alt={card.title}
                className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{card.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.category} · {card.tag}</p>
              </div>
              {/* Status badge — desktop */}
              <span className={`hidden sm:inline-flex shrink-0 items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                card.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {card.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2 mt-3 sm:mt-0 flex-wrap">
              {/* Status badge — mobile */}
              <span className={`sm:hidden text-xs px-2.5 py-1 rounded-full font-medium ${
                card.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {card.is_active ? 'Active' : 'Hidden'}
              </span>

              <div className="hidden sm:block flex-1" />

              <button
                onClick={() => toggleActive(card)}
                className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {card.is_active ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => { setEditing({ ...card }); setIsNew(false); }}
                className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(card.id!)}
                className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-12">No cards yet — add one above.</p>
        )}
      </div>
    </div>
  );
}