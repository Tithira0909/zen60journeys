'use client';

import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface GalleryItem {
  photo: {
    url: string;
    text: string;
    pos?: string;
  };
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 420, autoRotateSpeed = 0.25, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const animationFrameRef = useRef<number | null>(null);
    const rotationRef = useRef(0);
    // true = freely auto-rotating, false = snapped/idle
    const autoRotatingRef = useRef(true);
    const [autoRotating, setAutoRotating] = useState(true);
    const [mounted, setMounted] = useState(false);

    const N = items.length;
    const angleStep = 360 / N;

    useEffect(() => {
      setMounted(true);
      autoRotatingRef.current = autoRotating;
    }, [autoRotating]);

    // Animation loop — always running, speed controlled by autoRotatingRef
    useEffect(() => {
      const step = () => {
        if (autoRotatingRef.current) {
          rotationRef.current += autoRotateSpeed;
          const totalAngle = ((rotationRef.current % 360) + 360) % 360;
          const nearest = Math.round(totalAngle / angleStep) % N;
          setCurrentIndex(nearest);
          setRotation(rotationRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(step);
      };

      animationFrameRef.current = requestAnimationFrame(step);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }, [angleStep, N, autoRotateSpeed]);

    // Snap to a specific index and pause — no auto-resume timer
    const goTo = (index: number) => {
      setAutoRotating(false);
      autoRotatingRef.current = false;

      const target = index * angleStep;
      const current = ((rotationRef.current % 360) + 360) % 360;
      let delta = target - current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      rotationRef.current += delta;
      setRotation(rotationRef.current);
      setCurrentIndex(index);
    };

    // Resume auto-rotation (called from scroll-indicator click)
    const resumeAutoRotate = () => {
      setAutoRotating(true);
      autoRotatingRef.current = true;
    };

    const goToPrev = () => goTo(((currentIndex - 1) + N) % N);
    const goToNext = () => goTo((currentIndex + 1) % N);

    // Responsive radius: shrink on small screens
    const [effectiveRadius, setEffectiveRadius] = useState(radius);
    useEffect(() => {
      const update = () => {
        const w = window.innerWidth;
        if (w < 480) setEffectiveRadius(Math.min(radius, 130));
        else if (w < 768) setEffectiveRadius(Math.min(radius, 220));
        else if (w < 1024) setEffectiveRadius(Math.min(radius, 300));
        else setEffectiveRadius(radius);
      };
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, [radius]);

    return (
      <section
        ref={ref}
        className={cn('flex flex-col items-center justify-center w-full min-h-screen px-4 py-16 pb-4', className)}
        style={{ background: '#F0EDE6' }}
        aria-label="Experiences Gallery"
        {...props}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="font-serif font-normal tracking-wide"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#2C2820', letterSpacing: '0.04em' }}
          >
            Experiences
          </h2>
          <p
            className="mt-2 uppercase tracking-widest"
            style={{ fontSize: '0.8rem', color: '#7A7165', fontFamily: 'sans-serif' }}
          >
            Curated moments from the journey
          </p>
        </div>

        {/* 3D Scene */}
        <div
          className="relative w-full"
          style={{
            maxWidth: '1000px',
            height: 'clamp(260px, 50vw, 520px)',
            perspective: '1800px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${-rotation}deg)`,
            }}
          >
            {items.map((item, i) => {
              const itemAngle = i * angleStep;
              const totalAngle = ((rotation % 360) + 360) % 360;
              const relAngle = ((itemAngle - totalAngle) % 360 + 360) % 360;
              const norm = relAngle > 180 ? 360 - relAngle : relAngle;
              const opacity = norm < 90 ? 1 : Math.max(0.55, 1 - ((norm - 90) / 90) * 0.45);

              return (
                <div
                  key={i}
                  className="absolute cursor-pointer"
                  style={{
                    width: 'clamp(120px, 18vw, 240px)',
                    height: 'clamp(170px, 26vw, 340px)',
                    left: '50%',
                    top: '50%',
                    marginLeft: 'calc(clamp(120px, 18vw, 240px) / -2)',
                    marginTop: 'calc(clamp(170px, 26vw, 340px) / -2)',
                     transform: `rotateY(${itemAngle}deg) translateZ(${mounted ? effectiveRadius : radius}px)`,
                    opacity,
                    transition: 'opacity 0.3s linear',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.09), 0 0 0 1px rgba(180,160,130,0.25)',
                  }}
                  onClick={() => goTo(i)}
                  role="button"
                  aria-label={`View experience ${i + 1}`}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="w-full h-full object-cover block"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={goToPrev}
            aria-label="Previous"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid rgba(90,75,55,0.3)',
              background: 'transparent',
              color: '#4A3E30',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(90,75,55,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ←
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', justifyContent: 'center', maxWidth: '200px' }}>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: i === currentIndex ? '#6B5740' : 'rgba(90,75,55,0.2)',
                  transition: 'background 0.3s',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            aria-label="Next"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid rgba(90,75,55,0.3)',
              background: 'transparent',
              color: '#4A3E30',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(90,75,55,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            →
          </button>
        </div>

        {/* Scroll to resume — only visible when paused */}
        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: autoRotating ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: autoRotating ? 'none' : 'auto',
          }}
        >
          <button
            onClick={resumeAutoRotate}
            style={{
              fontSize: '9px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#7A7165',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              fontFamily: 'sans-serif',
            }}
          >
            Resume rotation
          </button>
          {/* Animated tick line */}
          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'rgba(90,75,55,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#6B5740',
                animation: autoRotating ? 'none' : 'tickDown 1.4s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes tickDown {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </section>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };