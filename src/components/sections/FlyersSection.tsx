'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLYERS = [
  {
    id: '1',
    title: 'Sacred Rituals Today',
    category: 'SACRED RITUALS',
    location: 'Sri Dalada Maligawa, Kandy',
    description: 'Witness the sacred offering of food and flowers to the Tooth Relic. Feel the rhythmic drumming and deep devotion.',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000',
    date: '14 AUGUST 2025',
    time: '06:00 AM & 06:30 PM',
    admission: 'Free Entry · Dress Code Required',
    tag: 'Daily Ceremony',
  },
  {
    id: '2',
    title: 'Cultural Masks Eternal',
    category: 'CRAFTSMANSHIP',
    location: 'Ariyapala Mask Museum, Ambalangoda',
    description: 'Stories of living practitioners preserving Kolam and Sanni traditions through ancestral wood carving techniques.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000',
    date: 'OPEN YEAR ROUND',
    time: '09:00 AM – 05:30 PM',
    admission: 'LKR 500 · Guided Tours Available',
    tag: 'Living Heritage',
  },
  {
    id: '3',
    title: 'The Rhythm of Spirits',
    category: 'KANDYAN DANCE',
    location: 'Kandyan Art Association, Kandy',
    description: 'Experience the athletic grace of traditional Kandyan dancers during the Esala Perahera festivals.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2000',
    date: 'EVERY EVENING',
    time: '05:30 PM · Doors Open 05:00 PM',
    admission: 'LKR 1,000 · Reserve in Advance',
    tag: 'Cultural Performance',
  },
  {
    id: '4',
    title: 'Welcome to the Jungle',
    category: 'WILDLIFE SAFARI',
    location: 'Yala National Park, Hambantota',
    description: 'Venture into the dense shrublands where the leopard reigns supreme and the elephants roam free.',
    image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2000',
    date: 'OCT – APR SEASON',
    time: 'Dawn & Dusk Departures',
    admission: 'From USD 45 · Half & Full Day',
    tag: 'Wildlife Experience',
  }
];

export default function FlyersSection() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % FLYERS.length);

  const currentItem = FLYERS[index];

  return (
    <section className="relative w-full bg-[#f0ede6] overflow-hidden py-10 md:py-16 px-4 sm:px-6 md:px-12">

      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-2">What's On</p>
          <h2 className="text-3xl md:text-5xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Experiences &amp; Events
          </h2>
        </div>
        <p className="hidden md:block text-sm text-stone-400 max-w-xs text-right leading-relaxed">
          Curated cultural programmes, ceremonies &amp; wildlife encounters across the island.
        </p>
      </div>

      {/* Main layout — stacks on mobile, side-by-side on desktop */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-4 md:gap-5">

        {/* ── MAIN FLYER CARD ── */}
        <div className="relative flex-1 rounded-2xl md:rounded-3xl overflow-hidden min-h-120 sm:min-h-130 md:min-h-140 shadow-2xl">

          {/* Background Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentItem.id + '-bg'}
              src={currentItem.image}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />

          {/* Flyer Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id + '-text'}
              className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                  {currentItem.category}
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/60 border border-white/20 px-3 py-1 rounded-full">
                  {currentItem.tag}
                </span>
              </div>

              {/* Bottom Content */}
              <div>
                <div className="w-8 h-px bg-orange-400 mb-4 md:mb-5" />

                <h3
                  className="text-4xl md:text-6xl font-bold leading-none mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentItem.title.split(' ')[0]}
                </h3>
                <h3
                  className="text-4xl md:text-6xl font-bold leading-none mb-4 md:mb-5"
                  style={{ fontFamily: "'Playfair Display', serif", color: 'transparent', WebkitTextStroke: '1px white' }}
                >
                  {currentItem.title.split(' ').slice(1).join(' ')}
                </h3>

                <p className="text-xs md:text-sm opacity-70 mb-5 leading-relaxed max-w-sm">
                  {currentItem.description}
                </p>

                {/* Flyer Details Grid */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 border-t border-white/20 pt-4 md:pt-5">
                  <div>
                    <p className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/40 mb-1">Date</p>
                    <p className="text-[11px] md:text-xs font-semibold leading-snug">{currentItem.date}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/40 mb-1">Time</p>
                    <p className="text-[11px] md:text-xs font-semibold leading-snug">{currentItem.time}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/40 mb-1">Admission</p>
                    <p className="text-[11px] md:text-xs font-semibold leading-snug">{currentItem.admission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 md:mt-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 shrink-0">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p className="text-[11px] md:text-xs opacity-50">{currentItem.location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT COLUMN — desktop only ── */}
        <div className="hidden md:flex flex-col gap-4 justify-between w-44 md:w-52">
          {FLYERS.map((item, i) => {
            if (i === index) return null;
            return (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`}
                className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer ring-1 ring-black/10 shadow-lg"
                onClick={nextSlide}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[8px] tracking-[0.35em] uppercase text-orange-400 font-bold mb-0.5">{item.category}</p>
                  <p className="text-white text-xs font-semibold leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</p>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={nextSlide}
            className="w-full h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 transition-colors duration-300 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* ── BOTTOM STRIP — mobile only: tap-to-select thumbnails + next arrow ── */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex gap-2 flex-1 overflow-hidden">
            {FLYERS.map((item, i) => {
              if (i === index) return null;
              return (
                <motion.div
                  key={item.id}
                  className="relative flex-1 rounded-xl overflow-hidden cursor-pointer h-20 ring-1 ring-black/10 shadow-md"
                  onClick={() => setIndex(i)}
                  whileTap={{ scale: 0.97 }}
                >
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    <p className="text-white text-[9px] font-semibold leading-tight line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.title.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-white hover:bg-orange-500 transition-colors duration-300 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="max-w-7xl mx-auto mt-5 md:mt-6 flex items-center gap-2">
        {FLYERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-stone-800' : 'w-2 bg-stone-300'}`}
          />
        ))}
        <span className="ml-auto text-[10px] tracking-[0.4em] uppercase text-stone-400">
          {String(index + 1).padStart(2, '0')} / {String(FLYERS.length).padStart(2, '0')}
        </span>
      </div>

    </section>
  );
}