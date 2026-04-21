import ExperiencesHero from '@/components/sections/ExperiencesHero'
import ExperienceGrid from '@/components/sections/ExperienceGrid'
import ExperienceHighlights from '@/components/sections/ExperienceHighlights'
import ExperiencesGallery from '@/components/sections/ExperiencesGallery'  
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experiences | Zen60 Journeys',
  description: 'Signature moments, immersive stages, and elevated experiences at Zen60 — Port City Colombo.',
}

export default function ExperiencesPage() {
  return (
    <main className="bg-[#F0EDE6] min-h-screen">
      <ExperiencesHero />
      <ExperienceGrid />
      <ExperienceHighlights />
      <ExperiencesGallery />   
    </main>
  )
}