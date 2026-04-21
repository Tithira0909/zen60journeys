'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  isFirstSlide?: boolean;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
  isFirstSlide = false,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const scrollProgressRef = useRef<number>(0);
  const mediaFullyExpandedRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const updateProgress = (newProgress: number) => {
    scrollProgressRef.current = newProgress;
    setScrollProgress(newProgress);

    if (newProgress >= 1) {
      mediaFullyExpandedRef.current = true;
      setMediaFullyExpanded(true);
      setShowContent(true);
    } else if (newProgress < 0.75) {
      setShowContent(false);
    }

    if (newProgress < 1) {
      mediaFullyExpandedRef.current = false;
      setMediaFullyExpanded(false);
    }
  };

  useEffect(() => {
    scrollProgressRef.current = 0;
    mediaFullyExpandedRef.current = false;
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: Event) => {
      const we = e as unknown as WheelEvent;
      const expanded = mediaFullyExpandedRef.current;
      const progress = scrollProgressRef.current;

      if (expanded && we.deltaY < 0 && window.scrollY <= 5) {
        updateProgress(Math.max(progress - we.deltaY * -0.0009, 0));
        we.preventDefault();
      } else if (!expanded) {
        we.preventDefault();
        const scrollDelta = we.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(progress + scrollDelta, 0), 1);
        updateProgress(newProgress);
      }
    };

    const handleTouchStart = (e: Event) => {
      const te = e as unknown as TouchEvent;
      touchStartYRef.current = te.touches[0].clientY;
    };

    const handleTouchMove = (e: Event) => {
      const te = e as unknown as TouchEvent;
      const startY = touchStartYRef.current;
      if (!startY) return;

      const touchY = te.touches[0].clientY;
      const deltaY = startY - touchY;
      const expanded = mediaFullyExpandedRef.current;
      const progress = scrollProgressRef.current;

      if (expanded && deltaY < -20 && window.scrollY <= 5) {
        updateProgress(Math.max(progress - 0.02, 0));
        te.preventDefault();
      } else if (!expanded) {
        te.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const newProgress = Math.min(Math.max(progress + deltaY * scrollFactor, 0), 1);
        updateProgress(newProgress);
        touchStartYRef.current = touchY;
      }
    };

    const handleTouchEnd = () => { touchStartYRef.current = 0; };

    const handleScroll = () => {
      if (!mediaFullyExpandedRef.current && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    const handleForceExpand = () => {
      updateProgress(1);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('forceExpandHero', handleForceExpand);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('forceExpandHero', handleForceExpand);
    };
  }, []);

  useEffect(() => {
    if (!mediaFullyExpanded) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mediaFullyExpanded]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth  = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  // Tint: starts at 0.55 (comfortable dark), deepens to 0.15 as card expands
  // This keeps the image always visible — no white bleed-through
  const bgTintOpacity = 0.55 - scrollProgress * 0.4;

  const words = title ? title.split(' ') : [];
  const firstLine = words.slice(0, 2).join(' ');
  const secondLine = words.slice(2).join(' ');

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-dvh">
        <div className="relative w-full flex flex-col items-center min-h-dvh">

          {/*
            ── BACKGROUND ──────────────────────────────────────────────────────
            The image stays fully opaque at all times.
            A dark tint overlay fades FROM dark → less dark as the card expands,
            so the image beneath the card becomes more visible — not white.
          */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src={bgImageSrc}
              alt="Background"
              fill
              className="object-cover object-center"
              loading={isFirstSlide ? 'eager' : 'lazy'}
              priority={isFirstSlide}
              sizes="100vw"
            />
            {/* Dark tint — deepens slightly at rest, lightens as card expands */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundColor: '#0a1a14',
                opacity: bgTintOpacity,
              }}
            />
          </div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-dvh relative">

              {/* ── EXPANDING CARD ── */}
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.4)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc + (mediaSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' + mediaSrc.split('v=')[1]
                        }
                        className="w-full h-full rounded-xl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 z-10 pointer-events-none" />
                      <motion.div
                        className="absolute inset-0 bg-black/30 rounded-xl"
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay muted loop playsInline preload="auto"
                        className="w-full h-full object-cover rounded-xl"
                        disablePictureInPicture
                      />
                      <div className="absolute inset-0 z-10 pointer-events-none" />
                      <motion.div
                        className="absolute inset-0 bg-black/30 rounded-xl"
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      fill
                      sizes="(max-width: 768px) 95vw, 1200px"
                      className="object-cover object-center"
                      loading={isFirstSlide ? 'eager' : 'lazy'}
                      priority={isFirstSlide}
                    />
                    {/* Card overlay — lightens as card expands so image pops */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: '#000' }}
                      animate={{ opacity: 0.45 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* ── SCROLL HINT TEXT (below card) ── */}
              <div
                className="flex flex-col items-center text-center relative z-10 mt-4"
                style={{
                  position: 'absolute',
                  bottom: `calc(50% - ${mediaHeight / 2}px - 48px)`,
                }}
              >
                {date && (
                  <p
                    className="text-2xl text-white/70"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {date}
                  </p>
                )}
                {scrollToExpand && (
                  <p
                    className="text-white/60 font-medium text-center text-sm tracking-widest uppercase"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {scrollToExpand}
                  </p>
                )}
              </div>

              {/* ── LEFT TITLE ── */}
              <div
                className={`absolute left-4 md:left-8 top-[60%] -translate-y-1/2 flex flex-col items-start text-left gap-2 w-auto z-10 ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <div
                  className="flex flex-col items-start"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  <h2
                    className="text-3xl sm:text-4xl md:text-6xl font-semibold text-white leading-tight drop-shadow-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {firstLine}
                  </h2>
                  <h2
                    className="text-3xl sm:text-4xl md:text-6xl font-semibold text-white leading-tight drop-shadow-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {secondLine}
                  </h2>
                </div>
              </div>
            </div>

            {/* ── POST-EXPANSION CHILDREN ── */}
            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;