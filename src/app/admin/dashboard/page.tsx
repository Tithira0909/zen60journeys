'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import FlyersManager from './FlyersManager';
import ChronicleManager from './ChronicleManager';
import ExperiencesManager from './ExperiencesManager';
import GalleryManager from './GalleryManager';
import HighlightsManager from './HighlightsManager';
import HeroManager from './HeroManager';
import ToursManager from './ToursManager';
import TourCarouselManager from './ToursCarouselManager';
import ToursHeroManager from './ToursHeroManager';
import ItineraryManager           from './ItineraryHeroManager';
import ItineraryDaysManager       from './ItineraryDaysManager';
import ItineraryInclusionsManager from './ItineraryInclusionsManager';
import ItineraryCarouselManager   from './ItineraryCarouselManager';

type Section =
  | 'flyers'
  | 'chronicle'
  | 'experiences'
  | 'gallery'
  | 'highlights'
  | 'hero'
  | 'tours'
  | 'tour-carousel'
  | 'tours-hero'
  | 'itinerary-hero'
  | 'itinerary-days'
  | 'itinerary-inclusions'
  | 'itinerary-carousel';

const TITLES: Record<Section, string> = {
  flyers: 'Flyers',
  chronicle: 'Visual Chronicle',
  experiences: 'Experiences',
  gallery: 'Gallery',
  highlights: 'Highlights',
  hero: 'Hero Image',
  tours: 'Tour Cards',
  'tour-carousel': 'Experience Carousel',
  'tours-hero': 'Tours Hero Banner',
  'itinerary-hero':       'Itinerary · Hero Banner',
  'itinerary-days':       'Itinerary · Days',
  'itinerary-inclusions': 'Itinerary · Inclusions',
  'itinerary-carousel':   'Itinerary · Carousel',
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const active = (searchParams.get('section') as Section) || 'flyers';

  return (
    <div className="min-h-screen bg-[#f0ede6] pl-56">
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-base font-semibold text-gray-800">
          {TITLES[active] ?? 'Dashboard'}
        </h1>
      </header>

      <main className="px-8 py-8 max-w-5xl">
        {active === 'flyers'         && <FlyersManager />}
        {active === 'chronicle'      && <ChronicleManager />}
        {active === 'experiences'    && <ExperiencesManager />}
        {active === 'gallery'        && <GalleryManager />}
        {active === 'highlights'     && <HighlightsManager />}
        {active === 'hero'           && <HeroManager />}
        {active === 'tours'          && <ToursManager />}
        {active === 'tour-carousel'  && <TourCarouselManager />}
        {active === 'tours-hero'     && <ToursHeroManager />}
        {active === 'itinerary-hero'       && <ItineraryManager />}
        {active === 'itinerary-days'       && <ItineraryDaysManager />}
        {active === 'itinerary-inclusions' && <ItineraryInclusionsManager />}
        {active === 'itinerary-carousel'   && <ItineraryCarouselManager />}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <Suspense><Sidebar /></Suspense>
      <Suspense><DashboardContent /></Suspense>
    </>
  );
}