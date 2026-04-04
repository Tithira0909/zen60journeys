'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navLinks = ['Home', 'Destinations', 'Experiences', 'Tours', 'About', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300',
        scrolled ? 'bg-black/30 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs">✦</span>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex items-center gap-1 bg-white/15 backdrop-blur-xl rounded-full px-5 py-2 border border-white/20 shadow-lg shadow-black/20">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href="#"
              className={cn(
                'text-sm px-3 py-1 rounded-full transition-colors text-white/80 hover:text-white hover:bg-white/10',
                link === 'Home' && 'bg-white/20 text-white'
              )}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Sign Up */}
      <button className="bg-white text-black text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 transition-colors">
        Sign Up
      </button>
    </nav>
  );
}