'use client';

import { useEffect, useState } from 'react';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';

const slides = [
  { src: '/images/sl-1.JPEG', alt: 'Sigiriya Rock Fortress' },
  { src: '/images/sl-2.JPEG', alt: 'Mirissa Beach' },
  { src: '/images/sl-3.JPEG', alt: 'Ella Nine Arch Bridge' },
  { src: '/images/sl-4.JPEG', alt: 'Horton Plains' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Pause carousel during scroll / expansion
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleWheel = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 800);
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (isScrolling || isExpanded) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isScrolling, isExpanded]);

  return (
    <div className="relative bg-[#0a1a14]">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={slides[current].src}
        bgImageSrc={slides[current].src}
        title="Unlock the Paradise island"
        scrollToExpand="Scroll to explore"
        textBlend={false}
        isFirstSlide={current === 0}
      >
        {/* Post-expansion content goes here later */}
      </ScrollExpandMedia>

      {/* ── RIGHT SIDE OVERLAY — Stats + Description + Buttons ── */}
      <div className="absolute inset-0 z-20 flex items-end md:items-center pointer-events-none">
        <div className="w-full px-6 sm:px-10 md:px-16 pb-24 md:pb-0 flex justify-end">
          <div className="flex flex-col gap-4 max-w-xs sm:max-w-sm pointer-events-auto">

            {/* Stats — stack on mobile, row on desktop */}
            <div className="flex gap-4 sm:gap-6">
              <div>
                <p className="text-white font-bold text-xl sm:text-2xl drop-shadow">98%</p>
                <p className="text-white/70 text-[11px] sm:text-xs leading-snug">Traveler Satisfaction</p>
              </div>
              <div>
                <p className="text-white font-bold text-xl sm:text-2xl drop-shadow">2500+</p>
                <p className="text-white/70 text-[11px] sm:text-xs leading-snug">Years of History</p>
              </div>
              <div>
                <p className="text-white font-bold text-xl sm:text-2xl drop-shadow">365</p>
                <p className="text-white/70 text-[11px] sm:text-xs leading-snug">Days of Hospitality</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed drop-shadow">
              From misty mountains to golden beaches, ancient temples to lush
              rainforests — your unforgettable journey begins here.
            </p>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button className="bg-white text-black px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors">
                Start Planning
              </button>
              <button className="border border-white/60 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Carousel dots ── */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}