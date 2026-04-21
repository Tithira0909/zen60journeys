'use client';

import React from 'react';
import Image from 'next/image';

const ToursHero: React.FC = () => {
  return (
    <div className="relative h-[60vh] min-h-130 flex items-center justify-center overflow-hidden">
      {/* Hero Image via next/image */}
      <Image
        src="/images/tours-banner.JPG"
        alt="Luxury Sri Lanka resort surrounded by jungle"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <p className="text-white/80 uppercase tracking-[4px] text-xs font-medium mb-5">
          The Curated Escape
        </p>

        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
          Curated Journeys
          <br />
          Across Sri Lanka
        </h1>

        <p className="text-white/85 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Experience travel, redefined with Zen Journeys. From mist-covered peaks to sun-drenched shores.
        </p>

        <button
          onClick={() =>
            document.getElementById('tours-section')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="bg-[#C9A227] hover:bg-[#B38F1A] active:scale-95 transition-all duration-200 text-white px-12 py-4 rounded-full text-base font-semibold tracking-wide shadow-lg"
        >
          Explore Tours
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50">
        <div className="w-px h-6 bg-white/30 animate-pulse" />
      </div>
    </div>
  );
};

export default ToursHero;