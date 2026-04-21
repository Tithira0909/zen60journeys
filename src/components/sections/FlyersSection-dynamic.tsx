'use client';

import React, {
  useState, useEffect, useRef, useCallback,
  forwardRef, useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface FlyerItem {
  id:             number;
  destination_id: number | null;
  title:          string;
  category:       string;
  location_text:  string;
  description:    string;
  image_url:      string;
  tag:            string;
  sort_order:     number;
}

export interface FlyersSectionHandle {
  jumpToDestination: (destinationId: number) => void;
}

// Side thumbnail 
function SideThumbnail({
  item,
  onClick,
}: {
  item: FlyerItem;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer ring-1 ring-black/10 shadow-lg min-h-0"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Image
        src={item.image_url}
        alt={item.title}
        fill
        sizes="200px"
        className="object-cover"
        loading="lazy"
        unoptimized={item.image_url.startsWith('http')}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[8px] tracking-[0.35em] uppercase text-orange-400 font-bold mb-0.5">
          {item.category}
        </p>
        <p
          className="text-white text-xs font-semibold leading-snug line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {item.title}
        </p>
      </div>
    </motion.div>
  );
}

// Skeleton loader 
function FlyerSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full">
      <div className="flex-1 rounded-2xl md:rounded-3xl bg-stone-200 animate-pulse min-h-120 md:min-h-140" />
      <div className="hidden md:flex flex-col gap-4 w-44 md:w-52">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 rounded-2xl bg-stone-200 animate-pulse" />
        ))}
        <div className="h-12 rounded-2xl bg-stone-200 animate-pulse" />
      </div>
    </div>
  );
}

const FlyersSection = forwardRef<FlyersSectionHandle>((_, ref) => {
  const [flyers, setFlyers]           = useState<FlyerItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [index, setIndex]             = useState(0);
  const [highlighted, setHighlighted] = useState(false);
  const sectionRef     = useRef<HTMLDivElement>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch flyers from API
  useEffect(() => {
    fetch('/api/flyers')
      .then((r) => r.json())
      .then((data) => {
        setFlyers(data.flyers ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load experiences. Please try again later.');
        setLoading(false);
      });
  }, []);

  useImperativeHandle(ref, () => ({
    jumpToDestination(destinationId: number) {
      const flyerIndex = flyers.findIndex(
        (f) => f.destination_id === destinationId
      );
      if (flyerIndex === -1) return;

      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        setIndex(flyerIndex);
        setHighlighted(true);
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlighted(false), 1800);
      }, 600);
    },
  }));

  useEffect(
    () => () => { if (highlightTimer.current) clearTimeout(highlightTimer.current); },
    []
  );

  const goNext = () => setIndex((i) => (i + 1) % flyers.length);

  const currentItem = flyers[index];
  const sideItems   = flyers.filter((_, i) => i !== index).slice(0, 3);

  return (
    <section
      id="flyers-section"
      ref={sectionRef}
      className="relative w-full bg-[#f0ede6] overflow-hidden py-10 md:py-16 px-4 sm:px-6 md:px-12"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-2">
            What's On
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-stone-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Experiences &amp; Events
          </h2>
        </div>
        <p className="hidden md:block text-sm text-stone-400 max-w-xs text-right leading-relaxed">
          Curated cultural programmes, ceremonies &amp; wildlife encounters across the island.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-4 md:gap-5">

        {/* Loading state */}
        {loading && <FlyerSkeleton />}

        {/* Error state */}
        {error && (
          <div className="flex-1 flex items-center justify-center min-h-60 text-stone-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && currentItem && (
          <>
            {/* MAIN FLYER CARD */}
            <div
              className={`relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden min-h-120 sm:min-h-130 md:min-h-140 shadow-2xl transition-all duration-700 ${
                highlighted
                  ? 'ring-4 ring-orange-400 ring-offset-4 ring-offset-[#f0ede6]'
                  : ''
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id + '-bg'}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <Image
                    src={currentItem.image_url}
                    alt={currentItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    unoptimized={currentItem.image_url.startsWith('http')}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id + '-text'}
                  className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                      {currentItem.category}
                    </span>
                    <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/60 border border-white/20 px-3 py-1 rounded-full">
                      {currentItem.tag}
                    </span>
                  </div>

                  <div>
                    <div className="w-8 h-px bg-orange-400 mb-4 md:mb-5" />
                    <h3
                      className="text-4xl md:text-6xl font-bold leading-none mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {currentItem.title.split(' ').slice(0, 2).join(' ')}
                    </h3>
                    <h3
                      className="text-4xl md:text-6xl font-bold leading-none mb-4 md:mb-5"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: 'transparent',
                        WebkitTextStroke: '1px white',
                      }}
                    >
                      {currentItem.title.split(' ').slice(2).join(' ')}
                    </h3>
                    <p className="text-xs md:text-sm opacity-70 mb-5 leading-relaxed max-w-sm">
                      {currentItem.description}
                    </p>

                    {/* Location row */}
                    <div className="flex items-center gap-2 border-t border-white/20 pt-4 md:pt-5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 shrink-0">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <p className="text-[11px] md:text-xs opacity-50">
                        {currentItem.location_text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN — desktop */}
            <div className="hidden md:flex flex-col gap-4 justify-between w-44 md:w-52">
              {sideItems.map((item) => (
                <SideThumbnail
                  key={item.id}
                  item={item}
                  onClick={() => setIndex(flyers.findIndex((f) => f.id === item.id))}
                />
              ))}
              <button
                onClick={goNext}
                className="w-full h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 transition-colors duration-300 shrink-0"
                aria-label="Next flyer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* BOTTOM STRIP — mobile */}
            <div className="flex md:hidden items-center gap-3">
              <div className="flex gap-2 flex-1 overflow-hidden">
                {sideItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="relative flex-1 rounded-xl overflow-hidden cursor-pointer h-20 ring-1 ring-black/10 shadow-md"
                    onClick={() => setIndex(flyers.findIndex((f) => f.id === item.id))}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="100px"
                      className="object-cover"
                      loading="lazy"
                      unoptimized={item.image_url.startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5">
                      <p className="text-white text-[9px] font-semibold leading-tight line-clamp-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.title.split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={goNext}
                className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 transition-colors duration-300 shrink-0"
                aria-label="Next flyer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {!loading && !error && flyers.length > 0 && (
        <div className="max-w-7xl mx-auto mt-5 md:mt-6 flex items-center gap-2">
          {flyers.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to flyer ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-stone-800' : 'w-2 bg-stone-300'
              }`}
            />
          ))}
          <span className="ml-auto text-[10px] tracking-[0.4em] uppercase text-stone-400">
            {String(index + 1).padStart(2, '0')} / {String(flyers.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
});

FlyersSection.displayName = 'FlyersSection';
export default FlyersSection;