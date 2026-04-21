"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock, CircleDollarSign } from "lucide-react";

export type ItineraryHeroData = {
  id: number;
  tour_id: number;
  badge_text: string;
  title: string;
  subtitle: string | null;
  duration_text: string;
  route_text: string;
  price_text: string;
  image_url: string;
  body_heading: string;
  body_text: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
};

type Props = {
  hero: ItineraryHeroData;
};

export default function ItineraryHero({ hero }: Props) {
  const heroRef = useRef(null);
  const bodyRef = useRef(null);

  // Controls the parallax / clip on the sticky hero image
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const clipPath = useTransform(
    heroScroll,
    [0, 1],
    ["inset(0% 0% 0% 0%)", "inset(5% 5% 5% 5% round 2rem)"]
  );
  const scale = useTransform(heroScroll, [0, 1], [1, 0.92]);
  const heroContentOpacity = useTransform(heroScroll, [0, 0.4], [1, 0]);

  return (
    <>
      {/* ── HERO (sticky, 100vh tall) ── */}
      <div ref={heroRef} className="relative h-screen">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            style={{ clipPath, scale }}
            className="relative h-full w-full"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${hero.image_url}')` }}
            />

            {/* Dark gradient so text is always readable */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/45 to-black/75" />

            {/* Hero text content */}
            <motion.div
              style={{ opacity: heroContentOpacity }}
              className="relative flex h-full flex-col items-center justify-center px-4 sm:px-8 text-white text-center"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-5 rounded-full border border-white/40 bg-black/35 backdrop-blur-md
                           px-5 py-1.5 text-[10px] sm:text-xs uppercase tracking-widest text-white shadow-sm"
              >
                {hero.badge_text}
              </motion.span>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-8xl font-serif mb-4 sm:mb-6 leading-tight
                           drop-shadow-[0_3px_16px_rgba(0,0,0,0.7)]"
              >
                {hero.title}
              </motion.h1>

              {/* Subtitle */}
              {hero.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="italic text-white/90 text-base sm:text-lg mb-6 px-4 max-w-xl
                             drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
                >
                  {hero.subtitle}
                </motion.p>
              )}

              {/* Meta pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4"
              >
                {[
                  { icon: <Clock size={14} />, text: hero.duration_text },
                  { icon: <MapPin size={14} />, text: hero.route_text },
                  { icon: <CircleDollarSign size={14} />, text: hero.price_text },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-black/45 backdrop-blur-sm rounded-full
                               px-4 py-2 border border-white/25 text-white shadow-lg"
                  >
                    <span className="opacity-75 shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm whitespace-nowrap font-light tracking-wide">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── EDITORIAL BODY — slides up OVER the hero on a solid card ── */}
      <div
        ref={bodyRef}
        className="relative z-20 bg-[#fdfbf7] rounded-3xl -mt-10
                   px-5 sm:px-10 md:px-16 pt-14 pb-20 mb-6 max-w-5xl mx-auto
                   shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
      >
        {/* Decorative top-rule */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#d6c9a8]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#a0916d]">Editorial</span>
          <div className="h-px flex-1 bg-[#d6c9a8]" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#8b7346] mb-7 leading-snug">
          {hero.body_heading}
        </h2>

        <p
          className="text-[#4a4a4a] leading-relaxed text-sm sm:text-base
                     first-letter:text-5xl first-letter:font-serif first-letter:float-left
                     first-letter:mr-3 first-letter:mt-1 first-letter:text-[#c4a97d]
                     first-letter:leading-none"
        >
          {hero.body_text}
        </p>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-3 gap-4 sm:gap-8 mt-14 pt-10
                     border-t border-[#e8dfc8] text-center"
        >
          {[
            { value: hero.stat_1_value, label: hero.stat_1_label },
            { value: hero.stat_2_value, label: hero.stat_2_label },
            { value: hero.stat_3_value, label: hero.stat_3_label },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-serif text-[#8b7346] leading-none">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#a09080] mt-2 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}