'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Droplets, Mountain, Utensils, ArrowRight, X,
  Star, Camera, Music, Train, Leaf, Binoculars,
  Heart, Sun, Wind, Bird, Tent, Landmark,
} from 'lucide-react';
import { latLonToPixelPct } from '@/lib/sriLankaLocations';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TourHighlight = {
  id: number;
  tour_id: number;
  icon_name: string;
  text: string;
  sort_order: number;
};

export type Tour = {
  id: number;
  tag: string;
  tag_color: string;
  title: string;
  type: string;
  days: number;
  description: string;
  flyer_description?: string | null;
  price: string;
  image_url: string;
  flyer_image_url?: string | null;
  location?: string | null;
  province?: string | null;
  coordinates?: string | null;
  map_pin_x?: number | null;
  map_pin_y?: number | null;
  lat?: number | null;
  lon?: number | null;
  highlights?: TourHighlight[];
};

type Props = {
  tour: Tour | null;
  onClose: () => void;
  flyerRef: React.RefObject<HTMLDivElement | null>;
};

const iconMap: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-4 h-4" />,
  Mountain: <Mountain className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Star: <Star className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Train: <Train className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  Binoculars: <Binoculars className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Wind: <Wind className="w-4 h-4" />,
  Bird: <Bird className="w-4 h-4" />,
  Tent: <Tent className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  MapPin: <MapPin className="w-4 h-4" />,
};

function resolvePinPosition(tour: Tour): { pinX: number; pinY: number } {
  if (tour.lat && tour.lon && tour.lat !== 0 && tour.lon !== 0) {
    const { x, y } = latLonToPixelPct(tour.lat, tour.lon, 'flyer');
    return { pinX: x, pinY: y };
  }
  return { pinX: tour.map_pin_x ?? 50, pinY: tour.map_pin_y ?? 50 };
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TourDetailFlyer: React.FC<Props> = ({ tour, onClose, flyerRef }) => {
  return (
    <AnimatePresence>
      {tour && (
        <motion.div
          ref={flyerRef}
          key={tour.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full relative bg-[#090E10] sm:bg-[#FDFCFB]"
        >
          {/* ── Cinematic Banner ── */}
          <div className="relative w-full min-h-145 md:h-150h-[680px]">

            {/* Background image + gradients — isolated in its own clipping layer */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={tour.flyer_image_url || tour.image_url}
                alt={tour.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#090E10]/90 sm:from-black/80 via-[#090E10]/40 sm:via-black/45 to-transparent sm:to-black/20" />
              <div className="absolute inset-0 bg-linear-to-t from-[#090E10] sm:from-black/60 via-transparent to-[#090E10]/20 sm:to-transparent" />
            </div>

            {/* ── Left content column ── */}
            <div className="relative z-10 h-full flex flex-col p-5 sm:p-8 md:p-10 lg:p-14 pb-56 sm:pb-28 md:pb-10">

              {/* Top row: label + close */}
              <div className="flex items-start justify-between">
                <p className="text-[#00C2CB] text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase">
                  Exploring Sri Lanka
                </p>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2.5 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full border border-white/20 text-white transition-all shrink-0 ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hero title */}
              <div className="mt-5 sm:mt-6 max-w-xs sm:max-w-xl lg:max-w-2xl">
                <h1 className="text-white font-black uppercase leading-[0.88] tracking-tight
                               text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  {tour.title.split(' ').map((word, i) => (
                    <span key={i} className={`block ${i === 1 ? 'text-[#00C2CB]' : ''}`}>
                      {word}
                    </span>
                  ))}
                </h1>

                <p className="text-white/65 text-xs sm:text-sm md:text-base mt-4 sm:mt-6 max-w-70 sm:max-w-sm md:max-w-md leading-relaxed">
                  {tour.flyer_description || tour.description}
                </p>
              </div>

              {/* Spacer — pushes highlights to the bottom on md+, natural flow on mobile */}
              <div className="flex-1 min-h-6" />

              {/* Experience Highlights card */}
              <div className="w-full max-w-65 sm:max-w-xs md:max-w-sm
                              bg-white/5 sm:bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5
                              mb-6 md:mb-8
                              relative z-10">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4">
                  Experience Highlights
                </p>
                <ul className="space-y-2.5 sm:space-y-3">
                  {(tour.highlights || []).slice(0, 3).map((h) => (
                    <li key={h.id} className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-cyan-500/20 border border-cyan-500/40
                                      flex items-center justify-center text-cyan-400">
                        {iconMap[h.icon_name] || <Star className="w-4 h-4" />}
                      </div>
                      <span className="text-white/85 text-xs sm:text-sm font-medium leading-tight">{h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Floating Map Card — desktop only, top-right ── */}
            <div className="
              hidden lg:flex flex-col
              absolute top-10 right-10 z-20
              w-72 xl:w-80
              bg-[#0D1517]/90 backdrop-blur-md
              rounded-[1.75rem] p-5
              border border-white/5 shadow-2xl
            ">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                  <span className="text-cyan-400 text-[8px] font-bold tracking-widest uppercase">Live Coordinates</span>
                </div>
                <span className="text-white/25 text-[8px] font-mono">
                  {tour.lat ? `${tour.lat}° N` : '5.9483° N'}, {tour.lon ? `${tour.lon}° E` : '80.4578° E'}
                </span>
              </div>

              <MapInset tour={tour} />

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h3 className="text-white font-black text-lg uppercase leading-tight">
                    {tour.location || 'Southern Coast'}
                  </h3>
                  <p className="text-[#00C2CB] text-[9px] font-bold tracking-widest uppercase mt-0.5">
                    {tour.province || 'Southern Province'}
                  </p>
                </div>
                <span className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Region</span>
              </div>
            </div>

            {/* ── Desktop Price / CTA Card ── */}
            <div className="
              hidden sm:block absolute z-30
              bottom-0
              right-6 md:right-10 lg:right-14
              w-auto max-w-xs md:max-w-sm
              translate-y-1/2
            ">
              <div className="bg-[#1a1a1a] rounded-4xl p-6 md:p-8 shadow-2xl border border-white/5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mb-1">
                      Starting From
                    </p>
                    <p className="text-white font-black text-3xl md:text-4xl leading-none">
                      LKR {tour.price}
                    </p>
                    <p className="text-white/20 text-[10px] mt-2 font-medium">
                      per person • All inclusive
                    </p>
                  </div>
                  <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-full
                                  text-[9px] font-bold border border-cyan-500/20 whitespace-nowrap ml-3 mt-0.5">
                    {tour.days} DAYS / {tour.days - 1} NIGHTS
                  </div>
                </div>

                <a
                  href={`/itinerary/${tour.id}`}
                  className="w-full flex items-center justify-center gap-3
                             bg-[#FF8254] hover:bg-[#ff6a33] active:scale-95
                             text-white font-bold py-4 md:py-5 rounded-xl
                             transition-all shadow-lg shadow-orange-600/20
                             uppercase tracking-widest text-xs"
                >
                  View Full Itinerary
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* ── Desktop Space reserved for bleeding card ── */}
          <div className="hidden sm:block h-24 md:h-28 bg-[#FDFCFB]" />

          {/* ── Mobile Layout Component (Price & Map) ── */}
          <div className="sm:hidden relative z-30 px-3 -mt-24 flex flex-col gap-3 pb-8">
            
            {/* Mobile Price / CTA Card */}
            <div className="bg-linear-to-br from-[#1A2528]/95 to-[#0A1012]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative ambient light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 blur-[30px] rounded-full -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[9px] font-extrabold uppercase tracking-[0.25em] mb-1.5">
                      Starting From
                    </span>
                    <span className="text-white font-black text-3xl leading-none tracking-tight">
                      LKR {tour.price}
                    </span>
                    <span className="text-white/30 text-[9px] mt-1.5 font-medium tracking-wide">
                      per person • All inclusive
                    </span>
                  </div>
                  <div className="flex items-center justify-center bg-[#0D1517] text-cyan-400 px-3 py-1.5 rounded-lg
                                  text-[9px] font-black border border-cyan-500/20 shadow-inner">
                    {tour.days}D / {tour.days - 1}N
                  </div>
                </div>

                <a
                  href={`/itinerary/${tour.id}`}
                  className="w-full flex items-center justify-center gap-2.5
                             bg-linear-to-r from-[#FF8254] to-[#FF5E1E] active:scale-[0.98]
                             text-white font-bold py-3.5 rounded-xl
                             transition-transform shadow-lg shadow-orange-900/40
                             uppercase tracking-[0.2em] text-[10px]"
                >
                  View Full Itinerary
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile Map Card */}
            <div className="bg-[#0A1012]/95 backdrop-blur-md rounded-3xl p-3 border border-white/5 shadow-xl relative overflow-hidden flex items-center gap-4">
               {/* Map inset on left */}
               <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative">
                 <MapInset tour={tour} />
                 {/* Inner shadow overlay for map inset */}
                 <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none rounded-xl" />
               </div>
               
               {/* Content on right */}
               <div className="flex flex-col flex-1 py-1 pr-2">
                 <div className="flex items-center gap-1.5 mb-2">
                   <div className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                   </div>
                   <span className="text-cyan-400 text-[8px] font-bold tracking-widest uppercase">Live Geo</span>
                 </div>
                 <h3 className="text-white font-black text-sm uppercase leading-tight tracking-wide">
                   {tour.location || 'Southern Coast'}
                 </h3>
                 <p className="text-[#00C2CB] text-[8px] font-bold tracking-[0.2em] uppercase mt-1 opacity-80">
                   {tour.province || 'Southern Province'}
                 </p>
               </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Map Inset Sub-component ─────────────────────────────────────────────────

function MapInset({ tour }: { tour: Tour }) {
  const { pinX, pinY } = resolvePinPosition(tour);

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0A1214]">
      <img
        src="/images/flyer-map.JPEG"
        alt="Sri Lanka Map"
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-110"
      />
      <div
        className="absolute z-10"
        style={{ left: `${pinX}%`, top: `${pinY}%`, transform: 'translate(-50%, -100%)' }}
      >
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="w-px h-4 bg-orange-500/50" />
        </div>
      </div>
    </div>
  );
}

export default TourDetailFlyer;