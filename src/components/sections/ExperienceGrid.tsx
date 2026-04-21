'use client'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface Experience {
  id: number
  title: string
  subtitle: string | null
  description: string
  image_url: string
  category: string | null
  duration: string | null
  tag: string
  sort_order: number
  is_active: number
}

function TiltCard({ item, index }: { item: Experience; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isInView = useInView(cardRef, { once: true, margin: '-60px' })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isTouchDevice = mounted && typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientY - rect.top) / rect.height - 0.5
    const y = (e.clientX - rect.left) / rect.width - 0.5
    setTilt({ x: x * -10, y: y * 10 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const isPremium = item.tag === 'Premium Add-On'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.025 : 1,
          boxShadow: isHovered
            ? '0 32px 56px -12px rgba(0,0,0,0.22)'
            : '0 2px 8px -2px rgba(0,0,0,0.08)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isHovered
            ? (isPremium ? '#ffffff' : '#18181b')
            : (isPremium ? '#18181b' : '#ffffff'),
          transition: 'background-color 0.35s ease',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '210px', flexShrink: 0 }}>
          <motion.img
            src={item.image_url}
            alt={item.title}
            animate={{ scale: isHovered ? 1.07 : 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Shimmer sweep on hover */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? '200%' : '-100%' }}
            transition={{ duration: 0.55 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
              pointerEvents: 'none',
            }}
          />
          {/* Tag badge */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span style={{
              fontSize: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontWeight: 600,
              backgroundColor: isPremium ? '#fbbf24' : 'rgba(255,255,255,0.9)',
              color: isPremium ? '#451a03' : '#3f3f46',
            }}>
              {item.tag}
            </span>
          </div>
          {/* Duration badge */}
          {item.duration && (
            <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
              <span style={{
                fontSize: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontWeight: 500,
                backgroundColor: 'rgba(0,0,0,0.45)',
                color: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(4px)',
              }}>
                {item.duration}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          color: isHovered
            ? (isPremium ? '#18181b' : '#ffffff')
            : (isPremium ? '#ffffff' : '#18181b'),
        }}>
          {item.category && (
            <p style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              margin: '0 0 6px',
              color: isHovered
                ? (isPremium ? '#a1a1aa' : '#71717a')
                : (isPremium ? '#71717a' : '#a1a1aa'),
            }}>
              {item.category}
            </p>
          )}
          <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>
            {item.title}
          </h3>
          {item.subtitle && (
            <p style={{
              fontSize: '11px',
              fontWeight: 500,
              margin: '0 0 6px',
              letterSpacing: '0.02em',
              color: isHovered
                ? (isPremium ? '#52525b' : '#d4d4d8')
                : (isPremium ? '#d4d4d8' : '#52525b'),
            }}>
              {item.subtitle}
            </p>
          )}
          <p style={{
            fontSize: '12px',
            lineHeight: 1.6,
            flex: 1,
            margin: '0 0 20px',
            color: isHovered
              ? (isPremium ? '#71717a' : '#a1a1aa')
              : (isPremium ? '#a1a1aa' : '#71717a'),
          }}>
            {item.description}
          </p>

          {/* Footer: a thin divider + availability note */}
          <div style={{
            borderTop: `1px solid ${
              isHovered
                ? (isPremium ? 'rgba(24,24,27,0.08)' : 'rgba(255,255,255,0.08)')
                : (isPremium ? 'rgba(255,255,255,0.08)' : 'rgba(24,24,27,0.08)')
            }`,
            paddingTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}>
            {/* Left: small dot + "Available on this journey" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: isPremium ? '#fbbf24' : '#86efac',
                boxShadow: isPremium
                  ? '0 0 6px rgba(251,191,36,0.5)'
                  : '0 0 6px rgba(134,239,172,0.5)',
              }} />
              <span style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                color: isHovered
                  ? (isPremium ? '#a1a1aa' : '#71717a')
                  : (isPremium ? '#71717a' : '#a1a1aa'),
              }}>
                {isPremium ? 'Premium Experience' : 'Included in Journey'}
              </span>
            </div>

            {/* Right: duration pill (only if not already shown on image) */}
            {!item.duration && item.category && (
              <span style={{
                fontSize: '9px',
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontWeight: 500,
                border: `1px solid ${
                  isHovered
                    ? (isPremium ? 'rgba(24,24,27,0.15)' : 'rgba(255,255,255,0.15)')
                    : (isPremium ? 'rgba(255,255,255,0.15)' : 'rgba(24,24,27,0.12)')
                }`,
                color: isHovered
                  ? (isPremium ? '#71717a' : '#a1a1aa')
                  : (isPremium ? '#a1a1aa' : '#71717a'),
              }}>
                {item.category}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ExperienceGrid() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experiences')
      .then(r => r.json())
      .then((data: Experience[]) => {
        setExperiences(data.filter(e => e.is_active === 1))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section style={{ backgroundColor: '#F0EDE6', padding: 'clamp(32px, 5vw, 64px) clamp(16px, 5vw, 48px) 96px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <p style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.45em',
            color: '#a1a1aa',
            margin: '0 0 12px',
          }}>
            The Collection
          </p>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: '#18181b',
            lineHeight: 1.2,
            margin: 0,
            fontFamily: '"Playfair Display", serif',
          }}>
            Signature Moments
          </h2>
          <div style={{
            margin: '16px auto 0',
            width: '40px',
            height: '1px',
            backgroundColor: '#d4d4d8',
          }} />
        </motion.div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
          }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#e4e1db',
                  height: '360px',
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
          }}>
            {experiences.map((item, index) => (
              <TiltCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}