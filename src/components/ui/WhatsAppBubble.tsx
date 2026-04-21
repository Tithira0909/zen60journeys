'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface WhatsAppBubbleProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppBubble({
  phoneNumber,
  message = "Hello! I'm interested in planning a trip with Zen Journeys. 🌿",
}: WhatsAppBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  // Fade in after 2 s so it doesn't fight the page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Show tooltip once, 4 s after bubble appears
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 4000);
    }, 4000);
    return () => clearTimeout(t);
  }, [visible]);

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Tooltip */}
      <div
        className="bg-white text-stone-700 text-xs font-medium px-3 py-2 rounded-xl shadow-lg border border-stone-100 whitespace-nowrap"
        style={{
          opacity: tooltip ? 1 : 0,
          transform: tooltip ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.95)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        Chat with us on WhatsApp 💬
        {/* Arrow */}
        <span
          className="absolute right-4 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-stone-100 rotate-45"
          style={{ display: 'block', position: 'absolute' }}
        />
      </div>

      {/* Bubble button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="group relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full opacity-40 animate-ping"
          style={{ backgroundColor: '#25D366', animationDuration: '2.5s' }}
        />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.494.655 4.835 1.797 6.865L2 30l7.335-1.775A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.45 11.45 0 01-5.847-1.606l-.418-.249-4.353 1.053 1.083-4.24-.273-.435A11.45 11.45 0 014.5 16C4.5 9.648 9.648 4.5 16 4.5S27.5 9.648 27.5 16 22.352 27.5 16 27.5zm6.29-8.61c-.345-.173-2.04-1.006-2.356-1.12-.316-.115-.546-.173-.776.173-.23.345-.89 1.12-1.09 1.35-.2.23-.4.26-.745.087-.345-.173-1.456-.537-2.773-1.71-1.025-.915-1.717-2.044-1.918-2.39-.2-.345-.02-.531.15-.703.155-.154.345-.403.518-.604.173-.2.23-.345.345-.575.115-.23.058-.432-.029-.604-.086-.173-.776-1.872-1.063-2.563-.28-.672-.563-.58-.776-.59l-.66-.012c-.23 0-.604.086-.92.432-.316.345-1.205 1.178-1.205 2.872s1.234 3.33 1.406 3.56c.173.23 2.428 3.709 5.883 5.2.823.355 1.465.567 1.966.727.826.263 1.578.226 2.172.137.663-.1 2.04-.834 2.328-1.638.287-.805.287-1.495.2-1.638-.086-.144-.316-.23-.66-.403z" />
        </svg>
      </a>
    </div>
  );
}