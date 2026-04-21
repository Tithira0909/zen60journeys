'use client'
import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Highlight {
  id: number
  number_label: string
  title: string
  description: string
  sort_order: number
  is_active: number
}

export default function ExperienceHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/experience-highlights')
      .then(r => r.json())
      .then((data: Highlight[]) => setHighlights(data))
      .catch(() => {})
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: '#F0EDE6' }}>

      {/* Botanical strip */}
      <div style={{ width: '100%', height: 'clamp(100px, 15vw, 160px)', overflow: 'hidden' }}>
        <img
          src="/images/botanical-strip.JPEG"
          alt="Botanical strip"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          minHeight: '580px',
          backgroundColor: '#F0EDE6',
        }}
      >
        {/* LEFT — text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 64px) clamp(20px, 7vw, 80px)',
            backgroundColor: '#F0EDE6',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#92400e',
              marginBottom: '10px',
              margin: '0 0 10px',
            }}>
              Summer 2026
            </p>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
              color: '#18181b',
              lineHeight: 1.2,
              margin: '0 0 40px',
              fontFamily: '"Playfair Display", serif',
            }}>
              Experience Highlights
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {highlights.map((item, index) => (
              <HighlightRow key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>

        {/* RIGHT — image card */}
        <ImageCard />
      </div>
    </section>
  )
}

/* Highlight row with animated line draw */
function HighlightRow({ item, index }: { item: Highlight; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
    >
      {/* Number */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.12 + 0.15, duration: 0.5 }}
        style={{
          fontSize: '1.1rem',
          fontWeight: 300,
          color: 'rgba(217,119,6,0.45)',
          paddingTop: '16px',
          width: '28px',
          flexShrink: 0,
          fontFamily: '"Playfair Display", serif',
        }}
      >
        {item.number_label}
      </motion.span>

      {/* Divider + text */}
      <div style={{ flex: 1, paddingTop: '14px', position: 'relative' }}>
        {/* Animated line draw */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '1px',
            backgroundColor: '#c8c3ba',
            marginBottom: '14px',
            transformOrigin: 'left',
          }}
        />
        <motion.h4
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.2, duration: 0.5 }}
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#18181b',
            margin: '0 0 6px',
          }}
        >
          {item.title}
        </motion.h4>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.3, duration: 0.5 }}
          style={{
            fontSize: '0.8rem',
            color: '#71717a',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {item.description}
        </motion.p>
      </div>
    </motion.div>
  )
}

/* Right image card with 3D float */
function ImageCard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientY - rect.top) / rect.height - 0.5
    const y = (e.clientX - rect.left) / rect.width - 0.5
    setTilt({ x: x * -6, y: y * 6 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 4vw, 40px)',
        backgroundColor: '#F0EDE6',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, rotateX: 6 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '520px', perspective: '1000px' }}
      >
        <motion.div
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            boxShadow: (tilt.x !== 0 || tilt.y !== 0)
              ? '0 32px 64px rgba(0,0,0,0.16)'
              : '0 20px 60px rgba(0,0,0,0.12)',
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            padding: '14px',
            backgroundColor: '#F0EDE6',
            borderRadius: '28px',
            transformStyle: 'preserve-3d',
            cursor: 'default',
          }}
        >
          {/* Image */}
          <motion.img
            src="/images/moment-6.JPG"
            alt="Festival highlight"
            initial={{ scale: 0.97 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '22px',
              aspectRatio: '16/10',
              display: 'block',
            }}
          />

          {/* Quote card — floats slightly in 3D */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: '28px',
              left: '28px',
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              padding: '16px 18px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxWidth: 'min(220px, calc(100% - 56px))',
              transform: 'translateZ(20px)',
            }}
          >
            <p style={{
              fontSize: '0.72rem',
              fontStyle: 'italic',
              color: '#3f3f46',
              margin: '0 0 6px',
            }}>
              "The most transformative musical experience in the Indian Ocean."
            </p>
            <p style={{
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#a1a1aa',
              margin: 0,
            }}>
              — Lifestyle Magazine
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}