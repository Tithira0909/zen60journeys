import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import VisualChronicle from '@/components/sections/VisualChronicle';
import InteractiveMap from '@/components/sections/InteractiveMap';
import UntoldSriLanka from '@/components/sections/UntoldSriLanka';
import FlyersSection from '@/components/sections/FlyersSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <VisualChronicle />
      <InteractiveMap />
      <UntoldSriLanka />
      <FlyersSection />
      <Footer />
    </main>
  );
}