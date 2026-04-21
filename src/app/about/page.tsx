import AboutHero from "@/components/sections/AboutHero";
import AboutMission from "@/components/sections/AboutMission";
import AboutStats from "@/components/sections/AboutStats";
import AboutCTA from "@/components/sections/AboutCTA";


export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-[#f0ede6]">
      <AboutHero />
      <AboutMission />
      <AboutStats />
      <AboutCTA />
    </main>
  );
}