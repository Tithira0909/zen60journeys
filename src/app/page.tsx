'use client';
import { useRef, Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import VisualChronicle from '@/components/sections/VisualChronicle-dynamic';
import InteractiveMap from '@/components/sections/InteractiveMap';
import FlyersSection from '@/components/sections/FlyersSection-dynamic';
import type { FlyersSectionHandle } from '@/components/sections/FlyersSection-dynamic';

function HomeContent() {
  const flyersSectionRef = useRef<FlyersSectionHandle>(null);

  return (
    <>
      <Hero />
      <VisualChronicle />
      <InteractiveMap flyersSectionRef={flyersSectionRef} /> 
      <FlyersSection ref={flyersSectionRef} /> 
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-[#FDFCF9]" />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}