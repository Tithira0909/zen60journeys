'use client'
import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ExperiencesHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [heroImage, setHeroImage] = useState('/images/experience-hero.JPG')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2])

  useEffect(() => {
    fetch('/api/experience-hero')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.image_url) setHeroImage(data.image_url)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        ref={containerRef}
        className="relative w-full h-[100svh] overflow-hidden bg-[#F0EDE6] -mt-px"
      >
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ scale: imageScale }}
        >
          <img
            src={heroImage}
            alt="Yaga Festival experience"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/50"
              style={{
                left: `${15 + i * 14}%`,
                top: `${65 + (i % 3) * 8}%`,
              }}
              animate={{ y: [-0, -100], opacity: [0, 0.5, 0.3, 0] }}
              transition={{
                duration: 6 + i * 1.2,
                delay: i * 1.1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* 3D Floating Title */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 sm:gap-4">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-sans"
          >
            Zen Journeys
          </motion.span>

          {/* 3D outline title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative select-none"
          >
            {/* Shadow / depth layer */}
            <span
              className="absolute font-playfair font-bold text-transparent pointer-events-none blur-[1px]"
              style={{
                fontSize: 'clamp(44px, 10vw, 92px)',
                WebkitTextStroke: '1px rgba(255,255,255,0.12)',
                letterSpacing: '0.06em',
                top: '6px',
                left: '6px',
                whiteSpace: 'nowrap',
              }}
              aria-hidden
            >
              EXPERIENCE
            </span>

            {/* Main outline text */}
            <motion.span
              className="relative block font-playfair font-bold text-transparent"
              animate={{
                rotateX: [4, -2, 4],
                rotateY: [-2, 3, -2],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                fontSize: 'clamp(44px, 10vw, 92px)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.78)',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                transformStyle: 'preserve-3d',
                perspective: '800px',
              }}
            >
              EXPERIENCE
            </motion.span>
          </motion.div>

          {/* Italic subtitle */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="font-playfair italic text-white/45 tracking-[0.12em]"
            style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}
          >
            the soul of Sri Lanka
          </motion.span>

          {/* Thin divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="w-8 h-px bg-white/25 mt-1"
          />
        </div>

        {/* Bottom logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3 pb-5"
        >
          <span className="text-white/40 text-[9px] uppercase tracking-[0.3em]">GRACIAS</span>
          <span className="text-white/25 text-[9px]">×</span>
          <span className="text-white/40 text-[9px] uppercase tracking-[0.3em]">YAGAimprints</span>
        </motion.div>

        {/* Scroll dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-4 h-1 bg-white/75 rounded-full"
          />
          <div className="w-1 h-1 bg-white/25 rounded-full self-center" />
          <div className="w-1 h-1 bg-white/25 rounded-full self-center" />
        </div>
      </section>

      {/* ── Transition Section ── */}
      <div className="relative bg-[#F0EDE6] overflow-hidden h-28 sm:h-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 right-6 sm:right-8 flex items-center gap-2"
        >
          <span className="text-zinc-400 text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-6 bg-zinc-300"
          />
        </motion.div>
      </div>
    </>
  )
}