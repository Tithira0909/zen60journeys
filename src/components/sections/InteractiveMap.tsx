"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { FlyersSectionHandle } from "./FlyersSection-dynamic";

function latLonToXY(lat: number, lon: number) {
  // Override coordinates for known locations to perfectly align with their illustrations
  // on the stylised map, as geographic lat/lon projection won't match a distorted illustration perfectly.
  const knownLocations = [
    { lat: 7.956846, lon: 880.759924, x: 66, y: 46 },    // Sigiriya 
    { lat: 7.290572, lon: 80.633728,   x: 48, y: 58 },   // Kandy 
    { lat: 66.8756,  lon: 81.0463,     x: 55, y: 62 },   // Ella 
    { lat: 5.948262, lon: 80.471587,   x: 55, y: 80 },   // Mirissa 
    { lat: 6.9271,   lon: 79.8478,     x: 31, y: 44 },   // Colombo 
    { lat: 8.5711,   lon: 81.2335,     x: 74, y: 28 },   // Trincomalee 
    { lat: 6.3728,   lon: 81.5169,     x: 64, y: 60 },   // Yala 
    { lat: 6.0336,   lon: 80.2139,     x: 33, y: 70 }    // Galle 
  ];

  const match = knownLocations.find(
    loc => Math.abs(loc.lat - lat) < 0.001 && Math.abs(loc.lon - lon) < 0.001
  );

  if (match) {
    return { x: match.x, y: match.y };
  }

  // Fallback linear calculation with visual padding adjustments for other dynamic coords
  const minLatIsland = 5.9;
  const maxLatIsland = 9.8;
  const minLonIsland = 79.5;
  const maxLonIsland = 81.9;

  const visualMinX = 28;
  const visualMaxX = 76;
  const visualMinY = 16;
  const visualMaxY = 85;

  const x = visualMinX + ((lon - minLonIsland) / (maxLonIsland - minLonIsland)) * (visualMaxX - visualMinX);
  const y = visualMinY + ((maxLatIsland - lat) / (maxLatIsland - minLatIsland)) * (visualMaxY - visualMinY);

  return { x, y };
}

// Destination data 
const destinations = [
  {
    id: 1,
    name: "Sigiriya",
    tag: "Ancient Fortress",
    description: "A 5th-century rock fortress rising 200m above the jungle canopy.",
    lat: 7.9570,
    lon: 80.7603,
    color: "#C8A96E",
    icon: "🏰",
    stats: { altitude: "200m", age: "5th C.", rating: "4.9" },
  },
  {
    id: 2,
    name: "Kandy",
    tag: "Cultural Capital",
    description: "Sacred Temple of the Tooth Relic, set beside a shimmering lake.",
    lat: 7.2906,
    lon: 80.6337,
    color: "#2A9D8F",
    icon: "🛕",
    stats: { altitude: "465m", age: "16th C.", rating: "4.8" },
  },
  {
    id: 3,
    name: "Ella",
    tag: "Highland Trails",
    description: "Misty mountains where morning clouds rest in the valleys below.",
    lat: 6.8667,
    lon: 81.0466,
    color: "#4CAF7D",
    icon: "🏔️",
    stats: { altitude: "1041m", trails: "12+", rating: "4.9" },
  },
  {
    id: 4,
    name: "Mirissa",
    tag: "Whale Watching",
    description: "Turquoise waters home to blue whales and spinner dolphins.",
    lat: 5.9483,
    lon: 80.4716,
    color: "#0077B6",
    icon: "🐋",
    stats: { depth: "200m", season: "Nov–Apr", rating: "4.7" },
  },
  {
    id: 5,
    name: "Colombo",
    tag: "The Capital",
    description: "A vibrant port city where colonial heritage meets modern skylines.",
    lat: 6.9339,
    lon: 79.8500,
    color: "#E76F51",
    icon: "🏙️",
    stats: { pop: "752K", founded: "1505", rating: "4.6" },
  },
  {
    id: 6,
    name: "Trincomalee",
    tag: "Beach Paradise",
    description: "One of the world's finest natural harbours with pristine coral reefs.",
    lat: 8.5874,
    lon: 81.2152,
    color: "#48CAE4",
    icon: "🏖️",
    stats: { beaches: "8+", coral: "Yes", rating: "4.8" },
  },
  {
    id: 7,
    name: "Yala",
    tag: "Wildlife Reserve",
    description: "Highest leopard density on Earth amid ancient ruins and wetlands.",
    lat: 6.3730,
    lon: 81.5150,
    color: "#8B5E3C",
    icon: "🐆",
    stats: { area: "979km²", species: "215+", rating: "4.9" },
  },
  {
    id: 8,
    name: "Galle",
    tag: "Colonial Fort",
    description: "A UNESCO-listed coastal fort blending Dutch history with ocean views.",
    lat: 6.0329,
    lon: 80.2168,
    color: "#6D597A",
    icon: "🏝️",
    stats: { founded: "1588", heritage: "UNESCO", rating: "4.8" },
  },
];

// Floating particle 
function Particle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-teal-400/20 pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `floatParticle ${6 + delay * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Pin component 
function DestinationPin({
  dest,
  isActive,
  onClick,
}: any) {
  const { x, y } = latLonToXY(dest.lat, dest.lon);

  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`View ${dest.name}`}
    >
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-60"
        style={{ backgroundColor: dest.color, animationDuration: "2s" }}
      />
      <span
        className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg text-sm transition-transform duration-300 group-hover:scale-125"
        style={{
          backgroundColor: dest.color,
          boxShadow: isActive ? `0 0 0 4px ${dest.color}55` : "",
          transform: isActive ? "scale(1.3)" : "",
        }}
      >
        {dest.icon}
      </span>
      <span
        className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] font-bold tracking-wide bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: dest.color }}
      >
        {dest.name}
      </span>
    </button>
  );
}

// Info card 
function InfoCard({
  dest,
  onClose,
  onExplore,
}: {
  dest: (typeof destinations)[0];
  onClose: () => void;
  onExplore: (destinationId: number) => void;
}) {
  const statEntries = Object.entries(dest.stats);
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-72 animate-cardIn">
      <div className="h-1.5 w-full" style={{ backgroundColor: dest.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-3xl">{dest.icon}</span>
            <h3 className="text-xl font-bold text-stone-800 mt-1 font-serif">{dest.name}</h3>
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: dest.color }}
            >
              {dest.tag}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors text-lg leading-none mt-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-stone-500 leading-relaxed mb-4">{dest.description}</p>

        <div className="grid grid-cols-3 gap-2">
          {statEntries.map(([key, val]) => (
            <div key={key} className="bg-stone-50 rounded-xl p-2 text-center">
              <div className="text-xs text-stone-400 uppercase tracking-wide">{key}</div>
              <div className="text-sm font-bold text-stone-700 mt-0.5">{val}</div>
            </div>
          ))}
        </div>

        {/* Explore button — scrolls to FlyersSection and activates the matching flyer */}
        <button
          onClick={() => onExplore(dest.id)}
          className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: dest.color }}
        >
          Explore {dest.name} →
        </button>
      </div>
    </div>
  );
}

// Props 
interface InteractiveMapSectionProps {
  flyersSectionRef: React.RefObject<FlyersSectionHandle | null>;
}

// Main section 
export default function InteractiveMapSection({ flyersSectionRef }: InteractiveMapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isHoveringMap, setIsHoveringMap] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  // Smooth lerp animation loop
  const animate = useCallback(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, 0.07);
    currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, 0.07);
    setTilt({ x: currentTilt.current.x, y: currentTilt.current.y });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = mapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetTilt.current = { x: -dy * 14, y: dx * 14 };
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
    setIsHoveringMap(false);
  }, []);

  const handleExplore = useCallback(
    (destinationId: number) => {
      flyersSectionRef.current?.jumpToDestination(destinationId);
      setActiveId(null); // close the card
    },
    [flyersSectionRef]
  );

  const activeDestination = destinations.find((d) => d.id === activeId);

  const [particles, setParticles] = useState<
    { x: number; y: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.4,
        size: 4 + Math.random() * 8,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen bg-[#F5F0E8] overflow-hidden flex flex-col items-center justify-center py-20 px-6">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      {/* Heading */}
      <div className="text-center mb-12 relative z-10">
        <p className="text-xs tracking-[0.3em] uppercase text-teal-600 font-semibold mb-2">
          Explore the Island
        </p>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 leading-tight">
          Every Corner Tells
          <br />
          <span className="text-teal-600 italic">a Story.</span>
        </h2>
        <p className="mt-4 text-stone-500 text-sm max-w-md mx-auto">
          Hover over the map to feel the island. Click any pin to uncover what awaits.
        </p>
      </div>

      {/* Main interactive area */}
      <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-10 w-full max-w-6xl">
        {/* 3D Map */}
        <div
          ref={mapRef}
          className="relative shrink-0 cursor-pointer select-none"
          style={{ perspective: "1000px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHoveringMap(true)}
        >
          {/* Shadow beneath map */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-4/5 h-16 bg-teal-900/20 blur-2xl rounded-full transition-all duration-500"
            style={{
              transform: `translateX(-50%) translateY(16px) scaleX(${isHoveringMap ? 0.85 : 1})`,
            }}
          />

          {/* Tilt wrapper */}
          <div
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.05s linear",
            }}
          >
            {/* Map frame */}
            <div className="relative w-85 md:w-110 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/70 backdrop-blur-sm bg-[#C8ECE8]">
              {/* Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {particles.map((p, i) => (
                  <Particle key={i} x={p.x} y={p.y} delay={p.delay} size={p.size} />
                ))}
              </div>

              {/* The illustrated map image */}
              <div className="relative w-full aspect-3/4">
                <Image
                  src="/images/map-sri-lanka.JPG"
                  alt="Sri Lanka illustrated map"
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Destination pins */}
                {destinations.map((dest) => (
                  <DestinationPin
                    key={dest.id}
                    dest={dest}
                    isActive={activeId === dest.id}
                    onClick={() => setActiveId(activeId === dest.id ? null : dest.id)}
                  />
                ))}
              </div>

              {/* Depth shimmer overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at ${50 + tilt.y * 2}% ${50 - tilt.x * 2}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
                  opacity: isHoveringMap ? 1 : 0,
                }}
              />
            </div>

            {/* Floating depth layer */}
            <div
              className="absolute -inset-3 rounded-3xl border border-teal-300/30 pointer-events-none"
              style={{ transform: "translateZ(-20px)" }}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col gap-6">
          {activeDestination ? (
            <div className="animate-fadeIn">
              <InfoCard
                dest={activeDestination}
                onClose={() => setActiveId(null)}
                onExplore={handleExplore}
              />
            </div>
          ) : (
            <div>
              <h3 className="text-stone-600 text-sm font-semibold tracking-widest uppercase mb-4">
                8 Iconic Destinations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {destinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => setActiveId(dest.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 text-left group border border-white/50"
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${dest.color}22`,
                        border: `1.5px solid ${dest.color}55`,
                      }}
                    >
                      {dest.icon}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-stone-700">{dest.name}</div>
                      <div className="text-xs text-stone-400">{dest.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400 italic">
                ↖ Drag the map or click a destination to explore
              </p>
            </div>
          )}

          {/* Stats bar */}
          <div className="flex gap-4 mt-2">
            {[
              { label: "UNESCO Sites", value: "8" },
              { label: "Km Coastline", value: "1,340" },
              { label: "Wildlife Parks", value: "26" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 bg-white/60 rounded-xl p-3 text-center border border-white/50 shadow-sm"
              >
                <div className="text-xl font-bold font-serif text-teal-700">{s.value}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wide mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-18px) scale(1.3); opacity: 0.8; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        :global(.animate-cardIn) { animation: cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        :global(.animate-fadeIn) { animation: fadeIn 0.3s ease forwards; }
      `}</style>
    </section>
  );
}