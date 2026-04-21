import Contact from '@/components/sections/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inquire | Zen60 Journeys',
  description: 'Embark on your next luxury escape. Contact our team to curate your signature travel experience in Sri Lanka.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F9F7F2]">
      <Contact />
    </main>
  )
}