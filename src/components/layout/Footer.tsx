import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0e1f1c]">

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* ── TOP HERO STRIP ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-14 pb-14 border-b border-white/10">
          {/* Brand */}
          <div>
            <p className="text-[10px] tracking-[0.55em] uppercase text-emerald-400/70 mb-3">
              Sri Lanka · Crafted Journeys
            </p>
            <h2
              className="text-6xl md:text-8xl font-bold text-white leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Zen60
            </h2>
            <h2
              className="text-6xl md:text-8xl font-bold leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.35)',
              }}
            >
              Journeys
            </h2>
          </div>

          {/* Tagline + CTA */}
          <div className="md:max-w-xs md:text-right">
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Slow travel, deep culture, wild nature. We craft journeys that feel like the island itself — unhurried, layered, alive.
            </p>
            <a
              href="mailto:hello@zen60journeys.lk"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-[#0e1f1c] transition-all duration-300"
            >
              Plan Your Journey
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── MAIN LINK GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14 border-b border-white/10">
          {/* Destinations */}
          <div>
            <h4 className="text-[9px] font-bold tracking-[0.45em] uppercase text-emerald-400/70 mb-5">Destinations</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Cultural Triangle', 'Hill Country', 'Southern Coast', 'East Coast', 'Rainforests', 'Sacred Sites'].map(l => (
                <li key={l}>
                  <Link href="#" className="hover:text-white transition-colors duration-200">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="text-[9px] font-bold tracking-[0.45em] uppercase text-emerald-400/70 mb-5">Experiences</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Wildlife Safaris', 'Temple Ceremonies', 'Tea Plantation Stays', 'Surf & Dive', 'Ayurveda Retreats', 'Village Homestays'].map(l => (
                <li key={l}>
                  <Link href="#" className="hover:text-white transition-colors duration-200">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan */}
          <div>
            <h4 className="text-[9px] font-bold tracking-[0.45em] uppercase text-emerald-400/70 mb-5">Plan</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Itinerary Builder', 'Travel Calendar', 'Visa & Entry', 'Getting Around', 'What to Pack', 'Travel Insurance'].map(l => (
                <li key={l}>
                  <Link href="#" className="hover:text-white transition-colors duration-200">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[9px] font-bold tracking-[0.45em] uppercase text-emerald-400/70 mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Our Story', 'Meet the Guides', 'Journal', 'Press', 'Responsible Travel', 'Contact Us'].map(l => (
                <li key={l}>
                  <Link href="#" className="hover:text-white transition-colors duration-200">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR — socials left, legal right ── */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 py-7">

          {/* Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-[11px] tracking-wide text-white/30 text-center">
            <p>© 2026 Zen60 Journeys (Pvt) Ltd. Registered Tour Operator · Sri Lanka Tourism Authority</p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms', 'Cookies'].map(l => (
                <Link key={l} href="#" className="hover:text-white/60 transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 20.5h9a5 5 0 005-5v-9a5 5 0 00-5-5h-9a5 5 0 00-5 5v9a5 5 0 005 5z' },
              { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              { label: 'TripAdvisor', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' },
            ].map(({ label, path }) => (
              <Link
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={path}/>
                </svg>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;