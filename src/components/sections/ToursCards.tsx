'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import TourDetailFlyer, { type Tour } from './TourDetailFlyer';

// ─── Constants ────────────────────────────────────────────────────────────────

const typeIcon: Record<string, string> = {
  FAMILY: '👨‍👩‍👧‍👦',
  COUPLE: '💑',
  SOLO: '👤',
  GROUP: '👥',
};

const DURATION_OPTIONS = [
  { label: 'Any Duration', min: 0, max: Infinity },
  { label: '1–3 Days',     min: 1, max: 3 },
  { label: '4–6 Days',     min: 4, max: 6 },
  { label: '7–10 Days',    min: 7, max: 10 },
  { label: '11+ Days',     min: 11, max: Infinity },
];

const BUDGET_OPTIONS = [
  { label: 'Any Budget',        min: 0,       max: Infinity },
  { label: 'Under LKR 50,000',  min: 0,       max: 50000 },
  { label: 'LKR 50k – 100k',    min: 50000,   max: 100000 },
  { label: 'LKR 100k – 200k',   min: 100000,  max: 200000 },
  { label: 'LKR 200k+',         min: 200000,  max: Infinity },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "125,000" or "125000" → 125000 */
function parsePrice(price: string): number {
  return parseInt(price.replace(/,/g, ''), 10) || 0;
}

/** Derive unique sorted values from tours array */
function deriveOptions<T>(tours: Tour[], fn: (t: Tour) => T | null | undefined): T[] {
  const set = new Set<T>();
  tours.forEach(t => { const v = fn(t); if (v != null && v !== '') set.add(v); });
  return Array.from(set).sort() as T[];
}

// ─── Filter State ─────────────────────────────────────────────────────────────

interface FilterState {
  duration: string;
  type: string;
  budget: string;
  province: string;
  travelers: string;
  search: string;
  [key: string]: string;
}

const DEFAULT_FILTERS: FilterState = {
  duration: 'Any Duration',
  type: 'All Types',
  budget: 'Any Budget',
  province: 'All Regions',
  travelers: 'All Travelers',
  search: '',
};

function applyFilters(tours: Tour[], filters: FilterState): Tour[] {
  return tours.filter(tour => {
    // Duration
    if (filters.duration !== 'Any Duration') {
      const opt = DURATION_OPTIONS.find(o => o.label === filters.duration);
      if (opt && (tour.days < opt.min || tour.days > opt.max)) return false;
    }

    // Type
    if (filters.type !== 'All Types' && tour.type !== filters.type) return false;

    // Budget
    if (filters.budget !== 'Any Budget') {
      const opt = BUDGET_OPTIONS.find(o => o.label === filters.budget);
      if (opt) {
        const p = parsePrice(tour.price);
        if (p < opt.min || p > opt.max) return false;
      }
    }

    // Province / Region
    if (filters.province !== 'All Regions') {
      const region = tour.province || tour.location || '';
      if (!region.toLowerCase().includes(filters.province.toLowerCase())) return false;
    }

    // Travelers (maps to type)
    if (filters.travelers !== 'All Travelers' && tour.type !== filters.travelers) return false;

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = [tour.title, tour.description, tour.location, tour.province, tour.tag]
        .filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

// ─── Custom Select Dropdown ───────────────────────────────────────────────────

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}

function FilterSelect({ label, value, options, onChange, icon }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = value !== options[0];

  return (
    <div ref={ref} className="relative flex-1 min-w-35">
      <label className="block text-[10px] uppercase tracking-[3px] text-gray-400 mb-2 font-medium">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full border rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-200 text-left ${
          isActive
            ? 'border-[#0d3d35] bg-[#0d3d35]/5 ring-1 ring-[#0d3d35]/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-gray-500 shrink-0">{icon}</span>}
          <span className={`text-sm font-medium truncate ${isActive ? 'text-[#0d3d35]' : 'text-gray-700'}`}>
            {value}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 ml-2 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          } ${isActive ? 'text-[#0d3d35]' : 'text-gray-400'}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-2xl shadow-xl shadow-black/10 overflow-hidden py-1"
          >
            {options.map(opt => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === opt
                      ? 'bg-[#0d3d35]/8 text-[#0d3d35] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  typeOptions: string[];
  provinceOptions: string[];
  activeCount: number;
  onClear: () => void;
}

function MobileFilterDrawer({
  open, onClose, filters, setFilters,
  typeOptions, provinceOptions, activeCount, onClear,
}: MobileDrawerProps) {
  const update = (key: keyof FilterState) => (value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-8">
              <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-5">
                <h3 className="text-base font-bold text-gray-900">Filter Tours</h3>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[3px] text-gray-400 mb-2 font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tour name, location…"
                      value={filters.search}
                      onChange={e => update('search')(e.target.value)}
                      className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0d3d35] focus:ring-1 focus:ring-[#0d3d35]/20 transition"
                    />
                  </div>
                </div>

                <FilterSelect label="Duration" value={filters.duration} options={DURATION_OPTIONS.map(o => o.label)} onChange={update('duration')} />
                <FilterSelect label="Type" value={filters.type} options={['All Types', ...typeOptions]} onChange={update('type')} />
                <FilterSelect label="Budget" value={filters.budget} options={BUDGET_OPTIONS.map(o => o.label)} onChange={update('budget')} />
                <FilterSelect label="Region" value={filters.province} options={['All Regions', ...provinceOptions]} onChange={update('province')} />
                <FilterSelect label="Travelers" value={filters.travelers} options={['All Travelers', ...typeOptions]} onChange={update('travelers')} />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => { onClear(); onClose(); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-50 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#0d3d35] text-white py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#0a2e28] transition"
                >
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Tour Card ────────────────────────────────────────────────────────────────

function TourCard({ tour, isActive, onViewDetails }: {
  tour: Tour;
  isActive: boolean;
  onViewDetails: (tour: Tour) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        scale: hovered ? 1.02 : 1,
        boxShadow: hovered
          ? '0 24px 48px -10px rgba(0,0,0,0.20)'
          : '0 2px 8px -2px rgba(0,0,0,0.08)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: hovered ? '#18181b' : '#ffffff',
        transition: 'background-color 0.32s ease',
        outline: isActive ? '2px solid #005F5F' : 'none',
        outlineOffset: '2px',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          <Image
            src={tour.image_url}
            alt={tour.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
        <span
          className={`${tour.tag_color} text-white absolute top-3 left-3`}
          style={{ fontSize: '8px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {tour.tag}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '14px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px',
          color: hovered ? '#ffffff' : '#111827',
          transition: 'color 0.32s ease',
        }}>
          {tour.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{
            fontSize: '9px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px',
            background: hovered ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
            color: hovered ? '#a1a1aa' : '#4b5563',
            transition: 'background 0.32s ease, color 0.32s ease',
          }}>
            {typeIcon[tour.type] ?? '🧳'} {tour.type}
          </span>
          <span style={{
            fontSize: '9px', fontWeight: 500,
            color: hovered ? '#71717a' : '#9ca3af',
            transition: 'color 0.32s ease',
            display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            {tour.days} Days
          </span>
        </div>

        <p style={{
          fontSize: '11px', lineHeight: 1.6, flex: 1, margin: '0 0 12px',
          color: hovered ? '#71717a' : '#6b7280',
          transition: 'color 0.32s ease',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {tour.description}
        </p>

        <div style={{
          borderTop: `0.5px solid ${hovered ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          paddingTop: '12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          transition: 'border-color 0.32s ease',
        }}>
          <div>
            <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', color: hovered ? '#71717a' : '#9ca3af', transition: 'color 0.32s ease' }}>
              Starting From
            </span>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: hovered ? '#ffffff' : '#111827', transition: 'color 0.32s ease' }}>
              LKR {tour.price}
            </div>
          </div>
          <button
            onClick={() => onViewDetails(tour)}
            style={{
              fontSize: '11px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
              color: isActive ? '#34d399' : (hovered ? '#fbbf24' : '#C9A227'),
              transition: 'color 0.2s ease',
              padding: 0,
            }}
          >
            {isActive ? 'Details Open ↓' : 'View Details →'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-gray-700 font-semibold text-base mb-1">No tours found</h3>
      <p className="text-gray-400 text-sm mb-5 max-w-xs">Try adjusting your filters or broadening your search criteria.</p>
      <button
        onClick={onClear}
        className="bg-[#0d3d35] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0a2e28] transition"
      >
        Clear Filters
      </button>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

const ToursSection: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/tours')
      .then(r => r.json())
      .then((data: Tour[]) => { setTours(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Derive dynamic options from actual tour data
  const typeOptions = deriveOptions(tours, t => t.type);
  const provinceOptions = deriveOptions(tours, t => t.province || t.location);

  const filteredTours = applyFilters(tours, filters);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'search') return v.trim() !== '';
    return v !== (DEFAULT_FILTERS as Record<string, string>)[k];
  }).length;

  const handleApply = () => {
    setFilters(pendingFilters);
    setSelectedTour(null);
  };

  const handleClear = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPendingFilters(DEFAULT_FILTERS);
    setSelectedTour(null);
  }, []);

  const handleViewDetails = (tour: Tour) => {
    if (selectedTour?.id === tour.id) { setSelectedTour(null); return; }
    setSelectedTour(tour);
    setTimeout(() => flyerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const handleClose = () => {
    setSelectedTour(null);
    document.getElementById('tours-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updatePending = (key: keyof FilterState) => (value: string) =>
    setPendingFilters(prev => ({ ...prev, [key]: value }));

  return (
    <>
      <div id="tours-section" className="bg-[#F8F5F0] pb-24">

        {/* ── Desktop Filter Bar ───────────────────────────────────────── */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/8 p-6 lg:p-8">

            {/* Search bar */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours by name, location, or type…"
                value={pendingFilters.search}
                onChange={e => updatePending('search')(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-gray-700 focus:outline-none focus:border-[#0d3d35] focus:ring-1 focus:ring-[#0d3d35]/20 transition placeholder:text-gray-400"
              />
            </div>

            {/* Dropdowns row */}
            <div className="flex flex-wrap items-end gap-x-4 gap-y-4">
              <FilterSelect
                label="Duration"
                value={pendingFilters.duration}
                options={DURATION_OPTIONS.map(o => o.label)}
                onChange={updatePending('duration')}
              />
              <FilterSelect
                label="Type"
                value={pendingFilters.type}
                options={['All Types', ...typeOptions]}
                onChange={updatePending('type')}
              />
              <FilterSelect
                label="Budget"
                value={pendingFilters.budget}
                options={BUDGET_OPTIONS.map(o => o.label)}
                onChange={updatePending('budget')}
              />
              <FilterSelect
                label="Region"
                value={pendingFilters.province}
                options={['All Regions', ...provinceOptions]}
                onChange={updatePending('province')}
              />
              <FilterSelect
                label="Travelers"
                value={pendingFilters.travelers}
                options={['All Travelers', ...typeOptions]}
                onChange={updatePending('travelers')}
              />
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              {/* Active filter pills */}
              <div className="flex flex-wrap gap-2">
                {activeFilterCount > 0 && Object.entries(filters).map(([key, val]) => {
                  const def = (DEFAULT_FILTERS as Record<string, string>)[key];
                  if (val === def || (key === 'search' && !val.trim())) return null;
                  return (
                    <span key={key} className="inline-flex items-center gap-1.5 bg-[#0d3d35]/8 text-[#0d3d35] text-xs font-semibold px-3 py-1 rounded-full border border-[#0d3d35]/15">
                      {key === 'search' ? `"${val}"` : val}
                      <button onClick={() => {
                        const next = { ...filters, [key]: def };
                        setFilters(next); setPendingFilters(next);
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {activeFilterCount === 0 && (
                  <span className="text-xs text-gray-400">No active filters</span>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600 uppercase text-xs font-semibold tracking-[2px] transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={handleApply}
                  className="bg-zinc-900 text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide hover:bg-zinc-700 active:scale-95 transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Filter Bar ────────────────────────────────────────── */}
        <div className="md:hidden max-w-7xl mx-auto px-4 -mt-6 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl shadow-black/8 p-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours…"
                value={filters.search}
                onChange={e => {
                  const next = { ...filters, search: e.target.value };
                  setFilters(next); setPendingFilters(next);
                }}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3d35] transition placeholder:text-gray-400"
              />
            </div>
            {/* Filter button row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-[#0d3d35] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Results count ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                <span className="font-semibold text-gray-700">{filteredTours.length}</span>
                {' '}tour{filteredTours.length !== 1 ? 's' : ''} found
                {activeFilterCount > 0 && (
                  <span className="text-gray-400"> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* ── Cards Grid ───────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredTours.length === 0 ? (
                  <EmptyState onClear={handleClear} />
                ) : (
                  filteredTours.map((tour) => (
                    <motion.div
                      key={tour.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <TourCard
                        tour={tour}
                        isActive={selectedTour?.id === tour.id}
                        onViewDetails={handleViewDetails}
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={pendingFilters}
        setFilters={setPendingFilters}
        typeOptions={typeOptions}
        provinceOptions={provinceOptions}
        activeCount={activeFilterCount}
        onClear={handleClear}
      />

      <TourDetailFlyer tour={selectedTour} onClose={handleClose} flyerRef={flyerRef} />
    </>
  );
};

export default ToursSection;