"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type ItineraryCarouselItem = {
  id: number;
  tour_id: number;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: number;
};

type Props = {
  items: ItineraryCarouselItem[];
};

const ExpandingCarousel = ({ items }: Props) => {
  const [activeId, setActiveId] = useState<number>(items[0]?.id ?? -1);

  if (!items.length) return null;

  return (
    <section className="w-full bg-[#FDFCFB] flex items-center justify-center py-12 overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:flex gap-3 w-full max-w-5xl h-[70vh] max-h-150 px-6 items-center justify-center">
        {items.map((dest) => {
          const isActive = activeId === dest.id;

          return (
            <motion.div
              key={dest.id}
              layout
              onClick={() => setActiveId(dest.id)}
              initial={false}
              animate={{
                flex: isActive ? 3 : 0.6,
                borderRadius: isActive ? '40px' : '60px',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="relative h-full cursor-pointer overflow-hidden shadow-sm"
            >
              <motion.img
                layout="position"
                src={dest.image_url}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: isActive ? 'brightness(0.9)' : 'brightness(0.7)' }}
              />

              {!isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span className="rotate-90 text-white font-bold tracking-[0.3em] whitespace-nowrap text-xs opacity-60 uppercase">
                    {dest.name}
                  </span>
                </motion.div>
              )}

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  <div className="bg-white/30 backdrop-blur-xl p-8 rounded-4xl border border-white/20 max-w-xs text-center">
                    <h3 className="text-3xl font-bold text-white mb-3 tracking-wider uppercase">
                      {dest.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed tracking-wide font-light">
                      {dest.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile layout — vertical stack */}
      <div className="flex md:hidden flex-col gap-3 w-full px-4">
        {items.map((dest) => {
          const isActive = activeId === dest.id;

          return (
            <motion.div
              key={dest.id}
              layout
              onClick={() => setActiveId(dest.id)}
              initial={false}
              animate={{
                height: isActive ? 320 : 64,
                borderRadius: 24,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="relative w-full cursor-pointer overflow-hidden shadow-sm"
            >
              <motion.img
                src={dest.image_url}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: isActive ? 'brightness(0.85)' : 'brightness(0.65)' }}
              />

              {!isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center px-6 pointer-events-none"
                >
                  <span className="text-white font-bold tracking-[0.2em] text-sm uppercase">
                    {dest.name}
                  </span>
                </motion.div>
              )}

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute inset-0 flex items-center justify-center p-6"
                >
                  <div className="bg-white/30 backdrop-blur-xl p-6 rounded-2xl border border-white/20 w-full max-w-sm text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wider uppercase">
                      {dest.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed font-light">
                      {dest.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpandingCarousel;