"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, MapPin, Ship, Plane, Train, Mountain,
  Camera, ArrowLeft, Clock, Navigation, Cloud, ChevronRight,
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ItineraryDay = {
  id: number;
  tour_id: number;
  day_number: number;
  title: string;
  description: string;
  tags: string | null;
  icon_name: string;
  map_label: string | null;
  weather_text: string | null;
  card_detail: string | null;
  duration_text: string | null;
  next_step_text: string | null;
  pin_x: number;
  pin_y: number;
  sort_order: number;
};

type Props = {
  days: ItineraryDay[];
};

// ─── Icon map ─────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ReactNode> = {
  Plane:    <Plane    size={14} />,
  Ship:     <Ship     size={14} />,
  MapPin:   <MapPin   size={14} />,
  Train:    <Train    size={14} />,
  Mountain: <Mountain size={14} />,
  Camera:   <Camera   size={14} />,
};

// ─── Reference city labels on the itinerary map ───────────────────────────────
//
// These positions are computed from latLonToPixelPct with the 'itinerary' bounds:
//   pctTop=5.4, pctBot=99.9, pctLeft=27.8, pctRight=84.0
//   GEO: lat 5.919–9.835, lon 79.521–81.879
//
// Do NOT use hardcoded guesses — every value below is pixel-accurate.
//
const ITINERARY_LABELS: { name: string; x: number; y: number }[] = [
  { name: "Jaffna",       x: 39.4, y: 9.4  },
  { name: "Trincomalee",  x: 68.5, y: 35.7 },
  { name: "Anuradhapura", x: 49.1, y: 42.1 },
  { name: "Sigiriya",     x: 57.1, y: 50.9 },
  { name: "Kandy",        x: 54.3, y: 66.8 },
  { name: "Colombo",      x: 35.6, y: 75.4 },
  { name: "Nuwara Eliya", x: 58.0, y: 75.0 },
  { name: "Ella",         x: 64.2, y: 77.0 },
  { name: "Bentota",      x: 39.2, y: 87.8 },
  { name: "Galle",        x: 44.5, y: 96.7 },
  { name: "Yala",         x: 75.4, y: 89.0 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ItineraryMap({ days }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [panelView, setPanelView]     = useState<"list" | "detail">("list");
  const [zoom, setZoom]               = useState(1);
  const [mobileView, setMobileView]   = useState<"list" | "map">("list");

  const activeDay = days[activeIndex] ?? null;

  // SVG route path across all day pins
  const pathData = useMemo(() => {
    if (days.length < 2) return "";
    return days
      .map((d, i) => (i === 0 ? `M ${d.pin_x} ${d.pin_y}` : `L ${d.pin_x} ${d.pin_y}`))
      .join(" ");
  }, [days]);

  const selectDay = (index: number) => {
    setActiveIndex(index);
    setPanelView("detail");
    setMobileView("map");
  };

  const backToList = () => setPanelView("list");

  return (
    <section
      className="flex flex-col lg:flex-row bg-[#f8f5f0] font-sans overflow-hidden rounded-2xl md:rounded-3xl shadow-sm"
      style={{ minHeight: '520px', height: 'clamp(520px, 75vh, 720px)' }}
    >
      {/* ── Mobile top toggle ─────────────────────────────────────── */}
      <div className="flex lg:hidden border-b border-gray-200 bg-white shrink-0">
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              mobileView === v ? "bg-[#2d2d2d] text-white" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {v === "list" ? "Timeline" : "Map"}
          </button>
        ))}
      </div>

      {/* ── LEFT PANEL ────────────────────────────────────────────── */}
      <div
        className={`
          w-full lg:w-[38%] shrink-0 flex flex-col
          border-r border-gray-200 bg-[#f8f5f0] overflow-hidden
          ${mobileView === "map" ? "hidden lg:flex" : "flex"}
        `}
        style={{ height: '100%' }}
      >
        {/* Panel header */}
        <div className="shrink-0 px-5 pt-5 pb-4 border-b border-gray-100 bg-[#f8f5f0]">
          <AnimatePresence mode="wait">
            {panelView === "list" ? (
              <motion.div
                key="list-header"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <span className="text-[9px] font-bold text-[#b58e58] uppercase tracking-widest">
                  Your Journey
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">
                  Day by Day
                </h2>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  {days.length} Days of Discovery
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="detail-header"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={backToList}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
                >
                  <ArrowLeft size={14} className="text-gray-600" />
                </button>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-[#b58e58] uppercase tracking-widest">
                    Day {String(activeDay?.day_number).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                    {activeDay?.title}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
          <AnimatePresence mode="wait">

            {/* ── LIST VIEW ─────────────────────────────────────── */}
            {panelView === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-4"
              >
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4.5 top-0 bottom-0 w-px border-l border-dashed border-gray-300 z-0" />

                  <div className="space-y-2.5">
                    {days.map((day, index) => {
                      const tags = day.tags
                        ? day.tags.split(",").map(t => t.trim()).filter(Boolean)
                        : [];
                      const isActive = activeIndex === index;

                      return (
                        <div key={day.id} className="relative flex gap-3 z-10">
                          {/* Day number dot */}
                          <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors duration-200 ${
                            isActive
                              ? "bg-[#2d2d2d] text-white"
                              : "bg-white border border-gray-200 text-gray-500"
                          }`}>
                            {String(day.day_number).padStart(2, "0")}
                          </div>

                          {/* Card */}
                          <button
                            className={`flex-1 text-left p-3.5 rounded-xl transition-all duration-200 group ${
                              isActive
                                ? "bg-[#2d2d2d] text-white shadow-lg"
                                : "bg-white text-gray-800 hover:bg-[#2d2d2d] hover:text-white hover:shadow-md"
                            }`}
                            onClick={() => selectDay(index)}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className={`transition-colors ${
                                isActive ? "text-[#b58e58]" : "text-gray-400 group-hover:text-[#b58e58]"
                              }`}>
                                {iconMap[day.icon_name] ?? <MapPin size={14} />}
                              </span>
                              <ChevronRight size={12} className={`transition-colors mt-0.5 ${
                                isActive ? "text-white/40" : "text-gray-300 group-hover:text-white/40"
                              }`} />
                            </div>
                            <h3 className="font-bold text-[13px] mb-1 leading-snug">{day.title}</h3>
                            <p className={`text-[11px] leading-relaxed line-clamp-2 mb-2 transition-colors ${
                              isActive ? "text-gray-300" : "text-gray-500 group-hover:text-gray-300"
                            }`}>
                              {day.description}
                            </p>
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[8px] font-bold border border-current px-1.5 py-0.5 rounded-full opacity-50">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── DETAIL VIEW ───────────────────────────────────── */}
            {panelView === "detail" && activeDay && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-5 space-y-5"
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activeDay.card_detail || activeDay.description}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2">
                  {activeDay.weather_text && (
                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                      <Cloud size={11} className="text-[#b58e58]" />
                      <span className="text-[11px] font-semibold text-gray-700">{activeDay.weather_text}</span>
                    </div>
                  )}
                  {activeDay.duration_text && (
                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                      <Clock size={11} className="text-[#b58e58]" />
                      <span className="text-[11px] font-semibold text-gray-700">{activeDay.duration_text}</span>
                    </div>
                  )}
                  {activeDay.next_step_text && (
                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                      <Navigation size={11} className="text-[#b58e58]" />
                      <span className="text-[11px] font-semibold text-gray-700">{activeDay.next_step_text}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {activeDay.tags && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDay.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold bg-[#2d2d2d] text-white px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location label */}
                {activeDay.map_label && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <MapPin size={13} className="text-[#FF8254]" />
                    <span className="text-[12px] font-bold text-gray-700">{activeDay.map_label}</span>
                  </div>
                )}

                {/* Day navigation */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    ← Prev Day
                  </button>
                  <button
                    onClick={() => setActiveIndex(Math.min(days.length - 1, activeIndex + 1))}
                    disabled={activeIndex === days.length - 1}
                    className="flex-1 py-2.5 rounded-xl bg-[#2d2d2d] text-[11px] font-bold text-white hover:bg-black disabled:opacity-30 transition-colors"
                  >
                    Next Day →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: MAP ─────────────────────────────────────────────── */}
      <div
        className={`
          flex-1 relative bg-[#e5d9c9] overflow-hidden
          ${mobileView === "list" ? "hidden lg:block" : "block"}
        `}
        style={{ minHeight: '320px' }}
      >
        {/* Zoomable inner */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {/* Map image
           *
           * IMPORTANT: itinerary-map.JPEG pin positions are computed as % of the
           * full image (both dimensions). We need the positioned overlay to cover
           * exactly the same area as the rendered image.
           *
           * We use a wrapper div that matches the map's rendered size via
           * padding-bottom (100% = square). objectFit:cover on a square container
           * for the square image = no letterbox, pins align perfectly.
           *
           * On mobile we use object-contain with extra padding so the full island
           * is visible; the overlay SVG & pins use the same contain math.
           */}

          {/* Full-size positioned layer for pins + SVG */}
          <div className="absolute inset-0 w-full h-full">

            {/* The map image */}
            <Image
              src="/images/itinerary-map.JPEG"
              alt="Sri Lanka Map"
              fill
              className="object-cover opacity-90"
              priority
            />

            {/* Route SVG — viewBox matches percentage space, so pins and path share coords */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              <motion.path
                d={pathData}
                fill="none"
                stroke="#FF8254"
                strokeWidth="0.35"
                strokeDasharray="1.5,1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Reference city labels — pixel-accurate positions */}
            {ITINERARY_LABELS.map(label => (
              <div
                key={label.name}
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm" />
                  <span
                    className="text-white/70 font-semibold whitespace-nowrap leading-none"
                    style={{
                      fontSize: "clamp(5px, 0.85vw, 8px)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.75), 0 0 6px rgba(0,0,0,0.5)",
                    }}
                  >
                    {label.name}
                  </span>
                </div>
              </div>
            ))}

            {/* Day pins */}
            {days.map((day, index) => (
              <button
                key={day.id}
                onClick={() => selectDay(index)}
                className="absolute z-20 group"
                style={{
                  left: `${day.pin_x}%`,
                  top: `${day.pin_y}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <motion.div
                  initial={{ scale: 0, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 border-2 ${
                    activeIndex === index
                      ? "bg-[#2d2d2d] border-white scale-125"
                      : "bg-[#FF8254] border-white/80 hover:scale-110"
                  }`}>
                    <span className="text-white text-[9px] font-bold leading-none">
                      {String(day.day_number).padStart(2, "0")}
                    </span>
                  </div>
                  <div className={`w-0.5 h-2 transition-colors ${
                    activeIndex === index ? "bg-[#2d2d2d]" : "bg-[#FF8254]"
                  }`} />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-30">
                  <div className="bg-[#2d2d2d] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                    {day.map_label || day.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.25, 2.5))}
            className="bg-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.25, 0.7))}
            className="bg-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Minus size={14} />
          </button>
        </div>

        {/* Active day badge */}
        <AnimatePresence>
          {activeDay && panelView === "detail" && (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-4 left-4 z-30 pointer-events-none"
            >
              <div className="bg-[#2d2d2d]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="text-[#b58e58] text-[10px] font-bold">
                  DAY {String(activeDay.day_number).padStart(2, "0")}
                </span>
                <span className="text-white/30 text-[10px]">·</span>
                <span className="text-white text-[11px] font-semibold max-w-40 truncate">
                  {activeDay.map_label || activeDay.title}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile "back to list" tap target on map view */}
        <button
          onClick={() => setMobileView("list")}
          className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-bold px-5 py-2.5 rounded-full shadow-lg border border-gray-200 flex items-center gap-2"
        >
          <ArrowLeft size={12} /> Back to Timeline
        </button>
      </div>
    </section>
  );
}