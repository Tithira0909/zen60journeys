import { notFound } from 'next/navigation'
import ItineraryHero from '@/components/sections/ItineraryHero'
import ItineraryMap from '@/components/sections/ItineraryMap'
import ItineraryInclusionsSection from '@/components/sections/ItineraryInclusionsSection'
import ExpandingCarousel from '@/components/sections/ToursExpandingCarousel'

async function getItinerary(tourId: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/itinerary?tour_id=${tourId}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tourId = Number(id)
  if (isNaN(tourId)) return notFound()

  const data = await getItinerary(tourId)

  if (!data || !data.hero) return notFound()

  const included = (data.inclusions ?? []).filter((i: any) => i.type === 'included')
  const notIncluded = (data.inclusions ?? []).filter((i: any) => i.type === 'not_included')

  return (
    <main className="bg-[#fdfbf7]">
      <ItineraryHero hero={data.hero} />

      {data.days?.length > 0 && (
        <ItineraryMap days={data.days} />
      )}

      {(included.length > 0 || notIncluded.length > 0) && (
        <ItineraryInclusionsSection included={included} notIncluded={notIncluded} />
      )}

      {data.carousel?.length > 0 && (
        <ExpandingCarousel items={data.carousel} />
      )}
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tourId = Number(id)
  const data = await getItinerary(tourId)
  if (!data?.hero) return { title: 'Itinerary | Zen Journeys' }
  return {
    title: `${data.hero.title} Itinerary | Zen Journeys`,
    description: data.hero.body_text?.slice(0, 160) ?? '',
  }
}