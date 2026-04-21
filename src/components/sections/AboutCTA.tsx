"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* Floating Particle */
function Particle({ index }: { index: number }) {
  const size = 2 + (index % 3);
  const left = `${(index * 17 + 11) % 100}%`;
  const duration = 6 + (index % 6);
  const delay = (index * 0.6) % 5;
  const drift = index % 2 === 0 ? "12px" : "-12px";

  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        bottom: "-6px",
        background:
          index % 3 === 0
            ? "rgba(230,184,0,0.5)"
            : "rgba(255,255,255,0.18)",
        animation: `ctaFloat ${duration}s linear ${delay}s infinite`,
        ["--drift" as any]: drift,
      }}
    />
  );
}

export default function AboutCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  /* 3D tilt */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const rx = ((e.clientY - cy) / rect.height) * 7;
    const ry = ((e.clientX - cx) / rect.width) * -7;

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 28, rotateX: 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.14,
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden flex flex-col items-center justify-center py-20 sm:py-28 md:py-36 px-5 sm:px-8 text-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/about-2.JPEG"
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-black/60" />

      {/* Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* CONTENT CARD */}
      <div
        ref={cardRef}
        className="relative z-20 flex flex-col items-center max-w-2xl w-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Eyebrow */}
        <motion.p
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs font-semibold uppercase tracking-widest mb-4 text-yellow-400"
        >
          Discover Yourself
        </motion.p>

        {/* Heading */}
        <motion.h2
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-white font-extrabold mb-4"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontFamily: "Georgia, serif",
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}
        >
          We Are Ready to Guide Your <br />
          Self-Discovery Journey
        </motion.h2>

        {/* line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="w-12 h-0.5 bg-yellow-400 mb-8"
        />

        {/* CTA BUTTON (FIXED JSX) */}
        <motion.div
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <a
            href="/tours"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center gap-2 bg-white text-black font-bold rounded-full px-8 py-3 text-sm cursor-pointer"
            style={{
              letterSpacing: "0.03em",
              animation: isInView
                ? "ctaPulse 2.5s 1.2s infinite"
                : "none",
              transform: hovered
                ? "scale(1.05) translateY(-2px)"
                : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            Start Your Journey
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </a>
        </motion.div>

        {/* Micro text */}
        <motion.p
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-5 text-white/60 text-xs"
        >
          No commitment · Personalised itineraries · Expert guides
        </motion.p>
      </div>
    </section>
  );
}