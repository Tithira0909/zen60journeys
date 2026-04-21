import React from 'react';
import type { Metadata } from 'next';
import ToursHero from '@/components/sections/ToursHero';
import ToursSection from '@/components/sections/ToursCards';
import Experience from '@/components/sections/ToursExperienceCarousel';

export const metadata: Metadata = {
  title: 'Tours | Zen Journeys',
  description: 'Explore our curated Sri Lanka tours — from ancient cultural trails to sun-drenched southern shores.',
};

export default function ToursPage() {
  return (
    <main>
      <ToursHero />
      <ToursSection />
      <Experience />
    </main>
  );
}