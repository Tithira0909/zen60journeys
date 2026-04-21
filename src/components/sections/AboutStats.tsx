// components/AboutStats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

/* Animated Number  */
function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numericValue = parseInt(value);
  const hasPlus = value.includes("+");
  const hasPercent = value.includes("%");

  const spring = useSpring(0, { mass: 1, stiffness: 45, damping: 18 });

  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current).toLocaleString();
    if (hasPlus) return `${rounded}+`;
    if (hasPercent) return `${rounded}%`;
    return rounded;
  });

  useEffect(() => {
    if (inView) spring.set(numericValue);
  }, [inView, numericValue, spring]);

  return <motion.span>{display}</motion.span>;
}

/* Skill Bar */
function SkillBar({
  label,
  percent,
  animate,
  index,
}: {
  label: string;
  percent: number;
  animate: boolean;
  index: number;
}) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, x: -24 }}
      animate={animate ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: 0.2 + index * 0.13,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm" style={{ color: "#0d7a6e" }}>
          {label}
        </span>
        <motion.span
          className="text-sm font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 + index * 0.13, duration: 0.4 }}
        >
          {percent}%
        </motion.span>
      </div>

      {/* Track */}
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{ height: "7px", background: "#e5e7eb" }}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full"
          style={{
            width: animate ? `${percent}%` : "0%",
            transitionProperty: "width",
            transitionDuration: "1.3s",
            transitionDelay: `${0.3 + index * 0.13}s`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            background: "linear-gradient(90deg, #e6b800 0%, #c49a00 100%)",
          }}
        />
        {/* Shimmer overlay */}
        {animate && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
              animation: `shimmer 2s ${0.3 + index * 0.13 + 1.3}s ease-out 1`,
              backgroundSize: "200% 100%",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* Stat Card */
function StatCard({
  stat,
  index,
  inView,
}: {
  stat: { value: string; label: string };
  index: number;
  inView: boolean;
}) {
  const isRight = index % 2 !== 0;
  const isBottom = index >= 2;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 px-4 sm:py-10"
      initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
      animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{
        delay: 0.15 + index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        borderRight: isRight ? "none" : "1px solid #1f1f1f",
        borderBottom: isBottom ? "none" : "1px solid #1f1f1f",
        transformStyle: "preserve-3d",
      }}
    >
      <span
        className="font-extrabold text-white leading-none mb-2"
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
          fontFamily: "'Georgia', serif",
        }}
      >
        <AnimatedNumber value={stat.value} inView={inView} />
      </span>

      <span
        className="text-xs font-medium text-center tracking-wide"
        style={{ color: "#888", letterSpacing: "0.06em" }}
      >
        {stat.label}
      </span>
    </motion.div>
  );
}

/* Data */
const skills = [
  { label: "Meditation & Breathwork", percent: 90 },
  { label: "Wilderness Connection", percent: 85 },
  { label: "Sustainable Living", percent: 77 },
];

const stats = [
  { value: "10+", label: "Years Curating" },
  { value: "50+", label: "Global Journeys" },
  { value: "100+", label: "Satisfied Explorers" },
  { value: "12", label: "Mindfulness Awards" },
];

/* Main Component */
export default function AboutStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 md:py-24 px-5 sm:px-8 overflow-hidden"
    >
      <style>{`
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position: 200% 0; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12 md:gap-16">

        {/* LEFT: Title + Skill Bars */}
        <div className="w-full md:w-[50%]">
          <motion.p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#aaa", letterSpacing: "0.18em" }}
            initial={{ opacity: 0, y: 12 }}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            What We Do Best
          </motion.p>

          <motion.h2
            className="font-extrabold leading-tight mb-4"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)",
              color: "#0d3d35",
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={animated ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            Our Signature Experiences
          </motion.h2>

          {/* Accent line */}
          <motion.div
            style={{
              height: "2px",
              width: "48px",
              background: "#0d3d35",
              transformOrigin: "left center",
              marginBottom: "1.25rem",
            }}
            initial={{ scaleX: 0 }}
            animate={animated ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="text-gray-500 text-sm leading-relaxed mb-8"
            initial={{ opacity: 0, y: 14 }}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Our methodology blends ancient mindfulness practices with modern
            exploration techniques to ensure a balanced spiritual and physical
            expedition.
          </motion.p>

          <div>
            {skills.map((skill, i) => (
              <SkillBar
                key={skill.label}
                label={skill.label}
                percent={skill.percent}
                animate={animated}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Stats Grid */}
        <div ref={statsRef} className="w-full md:w-[50%]" style={{ perspective: "900px" }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111" }}
            initial={{ opacity: 0, y: 40, rotateX: 18 }}
            animate={statsInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} inView={statsInView} />
              ))}
            </div>
          </motion.div>

          {/* Shadow depth illusion */}
          <motion.div
            className="mx-auto mt-3 rounded-2xl"
            style={{
              height: "16px",
              width: "80%",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 75%)",
              filter: "blur(6px)",
            }}
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={statsInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

      </div>
    </section>
  );
}