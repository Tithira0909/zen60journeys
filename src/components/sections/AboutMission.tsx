"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutMission() {
  const sectionRef = useRef(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // 3D tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const rx = ((e.clientY - cy) / rect.height) * 10;
    const ry = ((e.clientX - cx) / rect.width) * -10;

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-16 md:py-28 px-5 sm:px-8 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 40%, rgba(13,61,53,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20">

        {/* LEFT IMAGE */}
        <motion.div
          className="w-full md:w-[45%] shrink-0"
          initial={{ opacity: 0, x: -40, rotateY: -15 }}
          animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ perspective: "1200px" }}
        >
          <div
            ref={imageRef}
            className="relative w-full rounded-2xl overflow-hidden shadow-xl"
            style={{
              aspectRatio: "4/3",
              transformStyle: "preserve-3d",
              transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src="/images/about-mission.JPEG"
              alt="Zen journey mission image"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                zIndex: 1,
              }}
            />

            {/* quote */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.45,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="absolute bottom-4 left-4 right-4 z-10 bg-black/55 backdrop-blur-sm px-4 py-3 rounded-xl"
            >
              <p className="text-white text-xs font-semibold leading-relaxed">
                Every sunrise we share is a story <br /> we believe in
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT TEXT */}
        <div className="w-full md:w-[55%]" style={{ perspective: "800px" }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#888", letterSpacing: "0.18em" }}
          >
            About Zen60 Journeys
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.2,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="font-extrabold leading-tight mb-5"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#0d3d35",
              fontFamily: "'Georgia', serif",
            }}
          >
            We Craft Immersive Journeys
          </motion.h2>

          {/* line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="mb-6"
            style={{
              height: "2px",
              width: "52px",
              background: "#0d3d35",
              transformOrigin: "left",
            }}
          />

          {/* body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.35,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="text-gray-600 leading-relaxed mb-8"
          >
            Zen60 Journeys was born from the belief that true discovery happens
            at the intersection of stillness and adventure. We curate expeditions that just don't show
            you the world, but change how you see it. From silent retreats in high-altitude forests to guided
            wilderness trek, every detail is engineered for profound personal growth.
          </motion.p>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.45,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100"
          >
            {[
              { value: "200+", label: "Journeys" },
              { value: "98%", label: "Satisfaction" },
              { value: "6+", label: "Years" },
            ].map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p
                  className="font-extrabold"
                  style={{
                    fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                    color: "#0d3d35",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {item.value}
                </p>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}