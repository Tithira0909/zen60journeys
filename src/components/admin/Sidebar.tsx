'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Section =
  | 'flyers'
  | 'chronicle'
  | 'experiences'
  | 'gallery'
  | 'highlights'
  | 'hero'
  | 'tours'
  | 'tour-carousel'
  | 'tours-hero'
  | 'itinerary-hero'
  | 'itinerary-days'
  | 'itinerary-inclusions'
  | 'itinerary-carousel';

const NAV = [
  {
    group: 'Home',
    items: [
      { id: 'flyers', label: 'Flyers' },
      { id: 'chronicle', label: 'Visual Chronicle' },
    ],
  },
  {
    group: 'Experiences',
    items: [
      { id: 'experiences', label: 'Signature Moments' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'highlights', label: 'Highlights' },
      { id: 'hero', label: 'Hero Image' },
    ],
  },
  {
    group: 'Tours',
    items: [
      { id: 'tours', label: 'Tour Cards' },
      { id: 'tour-carousel', label: 'Experience Carousel' },
      { id: 'tours-hero', label: 'Hero Banner' },
    ],
  },
  {
    group: 'Tour Itinerary',
    items: [
      { id: 'itinerary-hero',       label: 'Hero Banner' },
      { id: 'itinerary-days',       label: 'Days' },
      { id: 'itinerary-inclusions', label: 'Inclusions' },
      { id: 'itinerary-carousel',   label: 'Carousel' },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const active = (searchParams.get('section') as Section) || 'flyers';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Home: true,
    Experiences: true,
    Tours: true,
    'Tour Itinerary': true,
  });

  const navigate = (section: Section) => {
    router.push(`/admin/dashboard?section=${section}`);
  };

  const toggleGroup = (group: string) => {
    setExpanded(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r bg-white">
      <div className="border-b px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Zen60 Journeys
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-800">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-600"
            >
              {group}
              <span className={`transition-transform ${expanded[group] ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {expanded[group] && (
              <div className="mt-1 space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id as Section)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition
                      ${
                        active === item.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}