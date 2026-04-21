"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  description: string;
  sort_order: number;
}

const ExperienceCarousel = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tour-carousel')
      .then(r => r.json())
      .then((data: CarouselItem[]) => {
        setItems(data);
        setIndex(data.length > 2 ? 2 : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const nextStep = () => setIndex((prev) => (prev + 1) % items.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  if (loading) {
    return (
      <section className="relative w-full min-h-100 bg-[#FDFCFB] flex items-center justify-center pt-4">
        <p className="text-gray-400 text-sm animate-pulse font-light tracking-widest">LOADING EXPERIENCE...</p>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section
      className="relative w-full bg-[#FDFCFB] flex flex-col items-center justify-center overflow-hidden pt-12"
      style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      {/* 
        KEY FIX: explicit white background ensures the dark flyer section above
        does not bleed through. The extra padding-top gives breathing room for
        the price card that "drips" down from the flyer above.
      */}

      {/* Decorative background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none overflow-hidden">
        <h1 className="text-[20vw] font-bold tracking-tighter text-gray-900 whitespace-nowrap">CEYLON</h1>
      </div>

      {/* Section heading — visible on mobile, adds context */}
      <div className="relative z-10 text-center mb-8 px-4">
        <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400 mb-2">Discover</p>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
          Our Experiences
        </h2>
      </div>

      {/* ── Desktop Carousel (md and above) ── */}
      <div className="relative hidden md:flex items-center justify-center w-full max-w-6xl h-137.5 px-16">

        {/* Cards */}
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, i) => {
            let position = i - index;
            if (position < -2) position += items.length;
            if (position > 2) position -= items.length;

            const isActive = position === 0;
            const isVisible = Math.abs(position) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  scale: isActive ? 1 : 0.75,
                  x: position * 260,
                  zIndex: isActive ? 50 : 30 - Math.abs(position),
                  filter: isActive ? 'blur(0px)' : 'blur(1px)',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="absolute w-[320px] h-120 rounded-[3rem] overflow-hidden shadow-xl cursor-pointer"
                onClick={() => setIndex(i)}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Side card vertical title */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-transparent transition-colors">
                    <span className="uppercase tracking-[0.4em] text-white font-bold text-[10px] rotate-90 whitespace-nowrap drop-shadow-md">
                      {item.title}
                    </span>
                  </div>
                )}

                {/* Active card glass overlay */}
                {isActive && (
                  <div className="absolute inset-0 flex items-end justify-center p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-4xl text-white text-center shadow-lg"
                    >
                      <h3 className="text-3xl font-black uppercase tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs font-light leading-relaxed opacity-90 max-w-55 mx-auto">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Nav buttons */}
        <button
          onClick={prevStep}
          className="absolute left-0 z-50 p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-800 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextStep}
          className="absolute right-0 z-50 p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-800 active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile Carousel (below md) ── */}
      <div className="relative flex md:hidden w-full flex-col items-center px-4">

        {/* Single active card */}
        <div className="relative w-full max-w-sm h-105 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={items[index]?.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src={items[index]?.image_url}
                alt={items[index]?.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Glass info overlay */}
              <div className="absolute inset-0 flex items-end justify-center p-6">
                <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-[1.75rem] text-white text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-1">
                    {items[index]?.title}
                  </h3>
                  <p className="text-[11px] font-light leading-relaxed opacity-90">
                    {items[index]?.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile nav row */}
        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={prevStep}
            className="p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-800 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-8 bg-gray-800' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="p-3 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-800 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop pagination dots */}
      <div className="hidden md:flex gap-2 mt-12">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? 'w-10 bg-gray-800' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceCarousel;