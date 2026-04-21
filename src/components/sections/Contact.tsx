"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

/*  Floating Particle  */
function Particle({ index }: { index: number }) {
  const size = 2 + (index % 3);
  const left = `${(index * 19 + 5) % 100}%`;
  const duration = 7 + (index % 5);
  const delay = (index * 0.55) % 6;
  const drift = index % 2 === 0 ? "10px" : "-10px";
  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        bottom: "-6px",
        background: "rgba(180,170,155,0.35)",
        animation: `contactFloat ${duration}s linear ${delay}s infinite`,
        ["--drift" as string]: drift,
      }}
    />
  );
}

/*  Skill Bar  */
function SocialItem({
  href,
  icon,
  name,
  delay,
  animate,
}: {
  href: string;
  icon: React.ReactNode;
  name: string;
  delay: number;
  animate: boolean;
}) {
  return (
    <motion.a
      href={href}
      className="social-item"
      initial={{ opacity: 0, x: -20, rotateY: -12 }}
      animate={animate ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="social-icon">{icon}</div>
      <span className="social-name">{name}</span>
      <div className="arrow-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.a>
  );
}

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", destination: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
      setFormData({ name: "", email: "", destination: "", website: "" });
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  /* 3D tilt on card */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 6;
    const ry = ((e.clientX - cx) / rect.width) * -6;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const textVariants = {
    hidden: { opacity: 0, y: 24, rotateX: 10 },
    visible: (i: number) => ({
      opacity: 1, y: 0, rotateX: 0,
      transition: { delay: i * 0.11, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
    }),
  };

  return (
    <div ref={sectionRef} className="contact-page">

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 16 }).map((_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* Decorative background lines */}
      <div className="bg-lines">
        <svg className="bg-svg" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <line x1="180" y1="0" x2="180" y2="700" stroke="#c8c4bc" strokeWidth="0.8"/>
          <line x1="980" y1="0" x2="980" y2="700" stroke="#c8c4bc" strokeWidth="0.8"/>
          <line x1="180" y1="150" x2="590" y2="150" stroke="#c8c4bc" strokeWidth="0.8"/>
          <path d="M180 80 C340 30, 480 130, 590 80" stroke="#c8c4bc" strokeWidth="0.9" fill="none"/>
          <circle cx="180" cy="80" r="3" fill="#b0aca4"/>
        </svg>
      </div>

      {/* CONTACT label */}
      <motion.div
        className="contact-label"
        initial={{ opacity: 0, y: -14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="contact-pill">
          <span>CONTACT</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="main-grid">

        {/* LEFT COLUMN */}
        <div className="left-col" style={{ perspective: "800px" }}>
          <motion.h1
            className="hero-heading"
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Embark on<br />your<br />journey
          </motion.h1>

          <motion.div
            className="dot-accent"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="subtext"
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            Curating unparalleled luxury travel experiences for the most discerning explorers. Every detail, meticulously refined.
          </motion.p>

          <motion.div
            className="logo-placeholder"
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            ZEN60 JOURNEYS
          </motion.div>

          <div className="social-links">
            <SocialItem
              href="#" animate={isInView} delay={0.35}
              name="Instagram"
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="3" y="3" width="22" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="20.5" cy="7.5" r="1.5" fill="currentColor"/>
                </svg>
              }
            />
            <SocialItem
              href="#" animate={isInView} delay={0.45}
              name="Facebook"
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 9h-2a1 1 0 0 0-1 1v2H11v3h2v6h3v-6h2l.5-3H16v-1.5A.5.5 0 0 1 16.5 10H19V9h-3Z" fill="currentColor"/>
                </svg>
              }
            />
          </div>
        </div>

        {/* RIGHT COLUMN — Inquiry Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 16 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ delay: 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: "1100px" }}
        >
          <div
            ref={cardRef}
            className="inquiry-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
            }}
          >
            {status === "success" ? (
              <motion.div
                className="success-state"
                initial={{ opacity: 0, scale: 0.92, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="success-icon"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke="#1a1a1a" strokeWidth="1.5"/>
                    <path d="M10 16.5L14 20.5L22 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
                <h2 className="card-heading">We've received<br />your inquiry</h2>
                <p className="success-text">Thank you, we'll be in touch shortly to begin curating your experience.</p>
                <button className="inquire-btn" style={{ marginTop: "28px" }} onClick={() => setStatus("idle")}>
                  SEND ANOTHER
                </button>
              </motion.div>
            ) : (
              <>
                <motion.h2
                  className="card-heading"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  Inquire about<br />your next escape
                </motion.h2>

                <div className="form-fields">
                  {/* Honeypot */}
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                    <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off"/>
                  </div>

                  {[
                    { name: "name", label: "NAME", type: "text" },
                    { name: "email", label: "EMAIL", type: "email" },
                  ].map(({ name, label, type }, i) => (
                    <motion.div
                      key={name}
                      className="field"
                      initial={{ opacity: 0, x: 16 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <label>{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        autoComplete="off"
                        disabled={status === "loading"}
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    className="field textarea-field"
                    initial={{ opacity: 0, x: 16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.62, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label>SHARE YOUR DREAM DESTINATION</label>
                    <textarea name="destination" value={formData.destination} onChange={handleChange} rows={4} disabled={status === "loading"}/>
                  </motion.div>

                  {status === "error" && (
                    <motion.div
                      className="error-msg"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {errorMsg}
                    </motion.div>
                  )}

                  <motion.button
                    className="inquire-btn"
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.72, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={status !== "loading" ? { scale: 1.02, y: -1 } : {}}
                    whileTap={status !== "loading" ? { scale: 0.98 } : {}}
                  >
                    {status === "loading" ? (
                      <><span className="spinner"/>SENDING...</>
                    ) : (
                      <>
                        INQUIRE NOW
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", repeatDelay: 1 }}
                          style={{ display: "inline-flex" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 9H15M15 9L9 3M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.span>
                      </>
                    )}
                  </motion.button>

                  <div className="partner-badge">
                    <div className="partner-logo">
                      <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
                        <rect width="30" height="10" fill="#888"/>
                        <rect y="12" width="30" height="10" fill="#aaa"/>
                      </svg>
                    </div>
                    <div className="divider-line"/>
                    <p className="partner-text">OFFICIAL PARTNER OF THE<br/>GLOBAL LUXURY COLLECTIVE</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

      </div>

      <style>{`
        .contact-page {
          background-color: #f0ede6;
          min-height: auto;
          font-family: 'Montserrat', sans-serif;
          position: relative;
          padding-bottom: 80px;
          padding-top: 70px;
          overflow: hidden;
        }
        .bg-lines { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .bg-svg { width: 100%; height: 100%; opacity: 0.6; }
        .contact-label {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 5px;
          padding: 28px 0 20px 36px;
          font-size: 10px; font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.1em; color: #333; font-weight: 500;
        }
        .contact-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; padding: 6px 14px; border-radius: 999px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .main-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; padding: 0 36px; align-items: start;
        }
        .left-col { padding-right: 40px; padding-top: 8px; }
        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 6vw, 88px);
          font-weight: 400; line-height: 1.0;
          color: #1a1a1a; letter-spacing: -0.01em; margin-bottom: 8px;
        }
        .dot-accent {
          width: 5px; height: 5px; border-radius: 50%;
          background: #888; margin: 2px 0 20px 6px;
        }
        .subtext {
          font-size: 13px; font-family: 'Montserrat', sans-serif;
          font-weight: 300; color: #555; line-height: 1.65;
          max-width: 340px; margin-bottom: 28px;
        }
        .logo-placeholder {
          font-size: 11px; font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.2em; color: #999; font-weight: 400; margin-bottom: 36px;
        }
        .social-links { display: flex; flex-direction: column; gap: 0; max-width: 360px; }
        .social-item {
          display: flex; align-items: center; gap: 16px;
          padding: 16px; border: 1px solid #d8d4cc; border-radius: 10px;
          text-decoration: none; color: #1a1a1a; background: transparent;
          margin-bottom: 10px;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .social-item:hover { background: white; box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
        .social-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .social-name { flex: 1; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
        .arrow-btn {
          width: 36px; height: 36px; background: #1a1a1a; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }
        .inquiry-card {
          background: #faf9f6; border-radius: 16px;
          padding: 40px 44px 36px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.06);
          margin-top: -10px;
        }
        .card-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 2.5vw, 30px);
          font-weight: 400; color: #1a1a1a; line-height: 1.25;
          margin-bottom: 32px; letter-spacing: -0.01em;
        }
        .form-fields { display: flex; flex-direction: column; gap: 0; }
        .field { position: relative; margin-bottom: 4px; }
        .field label {
          display: block; font-size: 9px; letter-spacing: 0.15em;
          color: #999; font-family: 'Montserrat', sans-serif;
          font-weight: 500; margin-bottom: 6px; padding-top: 12px;
        }
        .field input, .field textarea {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid #d0cdc8; outline: none;
          font-size: 14px; font-family: 'Montserrat', sans-serif;
          color: #1a1a1a; padding: 4px 0 10px; resize: none;
          transition: border-color 0.2s ease;
        }
        .field input:focus, .field textarea:focus { border-bottom-color: #888; }
        .field input:disabled, .field textarea:disabled { opacity: 0.5; cursor: not-allowed; }
        .textarea-field { margin-bottom: 28px; }
        .error-msg {
          font-size: 11px; color: #c0392b; font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.04em; margin-bottom: 16px; padding: 10px 14px;
          background: rgba(192,57,43,0.06); border-radius: 6px;
          border-left: 2px solid #c0392b;
        }
        .inquire-btn {
          width: 100%; background: #1a1a1a; color: #fff; border: none;
          padding: 18px 24px; border-radius: 6px; font-size: 11px;
          letter-spacing: 0.15em; font-family: 'Montserrat', sans-serif;
          font-weight: 500; cursor: pointer; display: flex;
          align-items: center; justify-content: center; gap: 10px;
          transition: background 0.2s ease, opacity 0.2s ease;
          margin-bottom: 24px;
        }
        .inquire-btn:hover:not(:disabled) { background: #333; }
        .inquire-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner {
          width: 14px; height: 14px;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .success-state { display: flex; flex-direction: column; align-items: flex-start; padding: 12px 0; }
        .success-icon { margin-bottom: 20px; opacity: 0.8; }
        .success-text {
          font-size: 13px; font-family: 'Montserrat', sans-serif;
          font-weight: 300; color: #555; line-height: 1.65; max-width: 320px;
        }
        .partner-badge { display: flex; align-items: center; gap: 14px; }
        .partner-logo { flex-shrink: 0; }
        .divider-line { width: 1px; height: 28px; background: #d0cdc8; flex-shrink: 0; }
        .partner-text {
          font-size: 9px; letter-spacing: 0.1em; color: #999;
          font-family: 'Montserrat', sans-serif; font-weight: 400; line-height: 1.6;
        }
        @keyframes contactFloat {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.4; }
          100% { transform: translateY(-600px) translateX(var(--drift)); opacity: 0; }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr; padding: 0 24px; }
          .left-col { padding-right: 0; padding-bottom: 32px; }
          .inquiry-card { margin-top: 0; padding: 32px 28px 28px; }
          .social-links { max-width: 100%; }
        }
        @media (max-width: 600px) {
          .contact-page { padding-top: 48px; padding-bottom: 48px; }
          .contact-label { padding-left: 20px; }
          .main-grid { padding: 0 18px; }
          .hero-heading { font-size: clamp(38px, 11vw, 56px); }
          .inquiry-card { padding: 24px 18px 20px; border-radius: 12px; }
          .card-heading { font-size: 20px; margin-bottom: 24px; }
          .subtext { max-width: 100%; font-size: 12px; }
          .inquire-btn { padding: 16px 20px; }
          .partner-badge { flex-wrap: wrap; gap: 10px; }
        }
        @media (max-width: 380px) {
          .hero-heading { font-size: 34px; }
          .inquiry-card { padding: 20px 14px 18px; }
        }
      `}</style>
    </div>
  );
}