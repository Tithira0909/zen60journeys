'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface ChronicleCard {
  id:        number;
  category:  string;
  title:     string;   
  tag:       string;
  image_url: string;
}

// Tilt card 
function TiltCard({ card, index }: { card: ChronicleCard; index: number }) {
  const cardRef               = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left)  / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)   / rect.height - 0.5) * -10;
    setTilt({ x, y });
  }, []);

  const resetTilt = () => { setTilt({ x: 0, y: 0 }); setHovered(false); };

  const [line1, line2] = card.title.split('\n');

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetTilt}
      className="flex-none w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] rounded-[20px] overflow-hidden relative h-96 cursor-pointer"
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) ${hovered ? 'translateY(-6px)' : 'translateY(0)'}`,
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease',
        boxShadow: hovered
          ? '0 24px 48px rgba(0,0,0,0.22)'
          : '0 4px 16px rgba(0,0,0,0.10)',
      }}
    >
      <Image
        src={card.image_url}
        alt={card.title}
        fill
        className="object-cover"
        style={{
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s ease',
        }}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        loading="lazy"
        unoptimized={card.image_url.startsWith('http')}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

      {/* Hover strip */}
      <a href='/tours'
        className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3 backdrop-blur-md bg-white/10 border-t border-white/20"
        style={{
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <span className="text-white/90 text-xs font-medium tracking-widest uppercase">
          View Details
        </span>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-[10px]">{card.tag}</span>
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <ArrowUpRight size={13} className="text-white" />
          </div>
        </div>
      </a>

      {/* Card info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5"
        style={{
          transform: hovered ? 'translateY(-52px)' : 'translateY(0)',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <p className="text-[9px] tracking-[0.16em] uppercase text-white/55 mb-1.5 font-medium">
          {card.category}
        </p>
        <h3 className="text-[19px] font-semibold text-white leading-tight">
          {line1}
          {line2 && <><br />{line2}</>}
        </h3>
      </div>
    </div>
  );
}

// Skeleton loader 
function CardSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-none w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] h-96 rounded-[20px] bg-neutral-200 animate-pulse"
        />
      ))}
    </div>
  );
}

// Main section 
export default function VisualChronicle() {
  const [cards, setCards]   = useState<ChronicleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const trackRef   = useRef<HTMLDivElement>(null);
  const dragStart  = useRef(0);
  const touchStart = useRef(0);

  // Fetch cards from API 
  useEffect(() => {
    setMounted(true);
    fetch('/api/chronicle')
      .then((r) => r.json())
      .then((data) => {
        setCards(data.cards ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const VISIBLE_DESKTOP = 3;
  const VISIBLE_MOBILE  = 1;
  
  // Hydration-safe screen checks
  const isMobile = mounted && typeof window !== 'undefined' && window.innerWidth < 640;
  const visibleCount = isMobile ? VISIBLE_MOBILE : VISIBLE_DESKTOP;

  const maxOffset = Math.max(
    0,
    cards.length - visibleCount
  );

  const goTo = (n: number) => setOffset(Math.max(0, Math.min(n, maxOffset)));
  const slide = (dir: number) => goTo(offset + dir);

  const onMouseDown  = (e: React.MouseEvent)  => { dragStart.current = e.clientX; };
  const onMouseUp    = (e: React.MouseEvent)  => {
    const diff = dragStart.current - e.clientX;
    if (Math.abs(diff) > 50) slide(diff > 0 ? 1 : -1);
  };
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) slide(diff > 0 ? 1 : -1);
  };

  const cardWidth  = trackRef.current?.children[0]?.getBoundingClientRect().width ?? 0;
  const translateX = offset * (cardWidth + 20);
  
  const progressWidth = (mounted && cards.length > 0)
    ? `${((offset + visibleCount) / cards.length) * 100}%`
    : '0%';

  return (
    <section className="bg-[#f5f2eb] px-6 md:px-12 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-10">
        <div>
          <h2 className="text-xl font-bold tracking-[0.12em] uppercase text-neutral-900 mb-3">
            The Visual Chronicle
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-[42ch]">
            Traverse through the misty hills, golden coasts, and ancient temples of Sri Lanka
            <br className="hidden sm:block" />{' '}
            through our immersive visual lens.
          </p>
        </div>

        <div className="flex gap-2 sm:pt-1 shrink-0">
          <button
            onClick={() => slide(-1)}
            disabled={offset === 0 || loading}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 disabled:opacity-25 transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => slide(1)}
            disabled={offset >= maxOffset || loading}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 disabled:opacity-25 transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <CardSkeleton />
      ) : (
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="flex gap-5"
            style={{
              transform: `translateX(-${translateX}px)`,
              transition: 'transform 0.55s cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          >
            {cards.map((card, i) => (
              <TiltCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-8 h-0.5 bg-neutral-300 rounded-full overflow-hidden max-w-xs">
        <div
          className="h-full bg-neutral-700 rounded-full transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>
    </section>
  );
}