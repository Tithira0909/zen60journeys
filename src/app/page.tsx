'use client';
import { useRef } from 'react';
import Hero from '@/components/sections/Hero';
import VisualChronicle from '@/components/sections/VisualChronicle-dynamic';
import InteractiveMap from '@/components/sections/InteractiveMap';
import FlyersSection from '@/components/sections/FlyersSection-dynamic';
import type { FlyersSectionHandle } from '@/components/sections/FlyersSection-dynamic';

export default function HomePage() {
  const flyersSectionRef = useRef<FlyersSectionHandle>(null);

  return (
    <main>
      <Hero />
      <VisualChronicle />
      <InteractiveMap flyersSectionRef={flyersSectionRef} /> 
      <FlyersSection ref={flyersSectionRef} /> 
    </main>
  );
}