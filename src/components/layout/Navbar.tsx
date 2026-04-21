'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',         href: '/',            sectionId: null },
  { label: 'Destinations', href: '/#flyers-section', sectionId: 'flyers-section' },
  { label: 'Experiences',  href: '/experiences', sectionId: null },
  { label: 'Tours',        href: '/tours',       sectionId: null },
  { label: 'About',        href: '/about',       sectionId: null },
  { label: 'Contact',      href: '/contact',     sectionId: null },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const isLightPage = pathname === '/contact';
  
  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  function handleNavClick(
    e: React.MouseEvent,
    sectionId: string | null
  ) {
    if (!sectionId) return;

    e.preventDefault();

    if (pathname === '/') {
      window.dispatchEvent(new Event('forceExpandHero'));
      
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      router.push(`/?scrollTo=${sectionId}`);
    }

    setMenuOpen(false);
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4 transition-all duration-300',
          scrolled
            ? isLightPage
              ? 'bg-black/5 backdrop-blur-xl border-b border-black/8'
              : 'bg-black/15 backdrop-blur-xl border-b border-white/8'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="absolute left-6 flex items-center gap-2 group">
          <div
            className={cn(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110",
              isLightPage ? "border-black/50" : "border-white"
            )} 
          >
            <span className={cn(isLightPage ? "text-black/70" : "text-white", "text-xs")}>✦</span>
          </div>
          <span 
            className={cn(
              "hidden sm:block text-sm font-semibold tracking-widest uppercase",
              isLightPage ? "text-black/70" : "text-white/80"
            )}
          >
            Zen Journeys
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul
          className={cn(
            'mx-auto hidden md:flex items-center gap-1 backdrop-blur-xl rounded-full px-5 py-2 border shadow-lg',
            isLightPage
              ? 'bg-black/8 border-black/15 shadow-black/10'
              : 'bg-white/15 border-white/20 shadow-black/20'
          )}
        >
          {NAV_LINKS.map(({ label, href, sectionId }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={(e) => handleNavClick(e, sectionId)}
                className={cn(
                  'text-sm px-3 py-1 rounded-full transition-colors',
                  label === 'Home'
                    ? pathname === '/'
                      ? (isLightPage ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                      : (isLightPage ? 'text-black/70 hover:text-black hover:bg-black/8' : 'text-white/80 hover:text-white hover:bg-white/10')
                    : pathname === href
                    ? (isLightPage ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                    : (isLightPage ? 'text-black/70 hover:text-black hover:bg-black/8' : 'text-white/80 hover:text-white hover:bg-white/10')
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
            ) : (
              <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'fixed top-17 left-0 right-0 z-40 md:hidden bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map(({ label, href, sectionId }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={(e) => handleNavClick(e, sectionId)}
                className="block text-sm text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}