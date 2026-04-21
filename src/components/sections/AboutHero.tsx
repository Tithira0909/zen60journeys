"use client";

import { useRef, useEffect } from "react";

export default function AboutHero() {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientY - cy) / rect.height) * 8;
      targetY = ((e.clientX - cx) / rect.width) * -8;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      image.style.transform = `scale(1.12) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[420px] md:h-[500px] overflow-hidden flex items-center justify-center"
      style={{ perspective: "800px" }}
    >
      {/* Hero Image — 3D tilt target */}
      <img
        ref={imageRef}
        src="/images/about-hero.JPEG"
        alt="About Zen Journeys"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{
          transform: "scale(1.12)",
          transformOrigin: "center center",
          willChange: "transform",
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 23 + 7) % 100}%`,
              bottom: "-8px",
              animation: `floatUp ${5 + (i % 5)}s linear ${(i * 0.7) % 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div
        className="relative z-20 text-center px-4"
        style={{ animation: "heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        {/* Eyebrow label */}
        <p
          className="uppercase tracking-[0.3em] text-white/60 mb-3 text-xs md:text-sm font-medium"
          style={{ animation: "heroFadeUp 0.9s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both" }}
        >
          Our Story
        </p>

        <h1
          className="text-white font-extrabold tracking-tight leading-tight"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            textShadow: "0 2px 32px rgba(0,0,0,0.5)",
          }}
        >
          About Us
        </h1>

        {/* Animated divider */}
        <div
          className="mx-auto mt-4 overflow-hidden"
          style={{ width: "60px", height: "1px" }}
        >
          <div
            className="w-full h-full bg-white/60"
            style={{ animation: "lineExpand 0.8s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both" }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="mt-4 text-white/70 text-sm md:text-base max-w-xs mx-auto tracking-wide"
          style={{ animation: "heroFadeUp 0.9s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both" }}
        >
          Crafting journeys through the heart of Sri Lanka
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineExpand {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-520px) translateX(${Math.random() > 0.5 ? "20px" : "-20px"}); opacity: 0; }
        }
      `}</style>
    </section>
  );
}