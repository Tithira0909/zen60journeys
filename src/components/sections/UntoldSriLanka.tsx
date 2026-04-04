'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

/* ─── Chapter Data ─────────────────────────────────────────────────────────── */
const chapters = [
  {
    id: '01',
    title: 'The Coastal Escape',
    subtitle: 'Where the jungle meets the teal',
    locations: ['Hiriketiya Cove', 'Weligama Village'],
    image: '/images/coast.JPEG',
    narration: [
      'Long before the sun clears the treeline, the cove belongs entirely to you. The fishermen are already out — balancing on wooden stilts driven into the seabed, the same way their grandfathers did, and their grandfathers before them. Nobody taught them to stop. Nobody needed to.',
      'Hiriketiya curves like a cupped hand around water so impossibly teal that first-time visitors actually stop walking and just stare. Beneath the surface, hawksbill turtles move in slow arcs through the reef, surfacing every few minutes with the unhurried patience of creatures who have outlasted every human civilisation that ever watched them from the shore.',
      'By the time you reach Weligama — a village that has survived tsunamis, colonial rule, and the relentless appetite of the tourism industry without losing its character — the morning catch is already spread across the dock. An old man mends a net. A child runs past with a bread roll. The Indian Ocean glitters behind them like it has no memory of anything difficult at all.',
    ],
  },
  {
    id: '02',
    title: 'Emerald Highlands',
    subtitle: 'Mist-covered tea trails',
    locations: ['Bogawantalawa', 'Bambarakanda Falls'],
    image: '/images/highlands.JPEG',
    narration: [
      'The train leaves Kandy before the valleys have finished deciding what colour they are. By the time you reach Ella, three hours have passed and the world outside the window has transformed entirely — waterfalls appearing without warning between the trees, valleys dropping so far below you that clouds form inside them, not above.',
      'The tea estates were planted by the British in the 1860s after a fungal blight wiped out every coffee plant on the island. What began as colonial salvage became something magnificent. Today the pickers move through the fields in the early light, each one harvesting only the top two leaves and a bud — a standard unchanged in a hundred and fifty years. The tea they produce leaves the island within days, ending up in cups in London, Tokyo, and Dubai, carrying no memory of the hands that held it first.',
      'Bambarakanda falls 263 metres in near-silence. You hear the mist on your face before you hear the water. Inside the pine forest that surrounds it — a forest that, botanically speaking, has no business existing this close to the equator — the temperature drops by ten degrees and the light goes a particular shade of grey that feels closer to Scotland than South Asia. It is one of the quietest places on the island, and one of the most disorienting.',
    ],
  },
  {
    id: '03',
    title: 'The Wild Frontier',
    subtitle: 'Untamed wetlands & lagoons',
    locations: ['Bundala Wetlands'],
    image: '/images/wild.JPEG',
    narration: [
      'At the southern edge of the island, where the land runs out of ambition and flattens entirely into salt flats and lagoons, the wild begins without announcement. There is no gate. No sign. Just a change in the air — something briny and mineral — and the sudden awareness that you are no longer the largest thing in the landscape.',
      'The flamingos arrive from breeding grounds in Gujarat, thousands of kilometres north, navigating by magnetic field and starlight. Nobody invited them. Nobody needs to. They have been landing in these same lagoons for longer than Sri Lanka has been a country, longer than its kingdoms, longer than any name given to this coastline by any people who ever stood on it. By dawn, the water is pink.',
      'The saltwater crocodiles do not move. That is the thing about them — they are so still for so long that you begin to doubt they are alive at all, and then something shifts at the water\'s edge, and the doubt dissolves instantly. Bundala is not the most famous park on the island. It does not have the leopards of Yala or the elephants of Minneriya. What it has is rarer: the feeling of a place that does not perform wildness for anyone.',
    ],
  },
  {
    id: '04',
    title: 'Sacred Rites',
    subtitle: 'Faith, fire, and drums',
    locations: ['Kataragama'],
    image: '/images/sacred.JPEG',
    narration: [
      'Once a year, under the full moon of the month of Esala, tens of thousands of pilgrims walk the length of the island on foot to reach Kataragama. Some carry kavadi — ornate metal structures attached to the body through skewers piercing the skin — and feel nothing. They will tell you this is not performance. They are not trying to impress you. They are doing what their grandmothers did, and their grandmothers before that, and the pain is beside the point.',
      'Kataragama is the only place in Sri Lanka — perhaps the only place in the world — where Buddhist monks, Hindu priests, Muslim imams, and the indigenous Vedda people conduct rituals within metres of each other, on the same holy ground, around the same fire, and nobody considers this remarkable. It has simply always been this way. The god here, Skanda, belongs to everyone and no one, which is perhaps why everyone comes.',
      'After midnight, when the procession ends and the drums finally go quiet, the smoke from a thousand oil lamps hangs in the air above the dagoba like something that has not yet decided whether to rise or settle. If you are still there — if you did not leave with the tour groups at ten o\'clock — you will stand in the silence and understand, without being able to explain it to anyone, why people walk barefoot across an entire island to be in this exact place.',
    ],
  },
];

/* ─── Narration Panel ───────────────────────────────────────────────────────── */
function NarrationPanel({ lines, chapterKey }: { lines: string[]; chapterKey: number }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => { setLineIndex(0); }, [chapterKey]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.p
          key={`${chapterKey}-${lineIndex}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-white/75 leading-[1.85] text-sm md:text-[15px]"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          &ldquo;{lines[lineIndex]}&rdquo;
        </motion.p>
      </AnimatePresence>

      {/* Step dots */}
      <div className="flex gap-1.5 mt-1">
        {lines.map((_, i) => (
          <button
            key={i}
            onClick={() => setLineIndex(i)}
            aria-label={`Narration line ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === lineIndex ? 'w-6 bg-[#2a9a80]' : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function UntoldSriLanka() {
  const [isExploring, setIsExploring] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const nextChapter = () => setCurrentChapter((prev) => (prev + 1) % chapters.length);
  const prevChapter = () => setCurrentChapter((prev) => (prev - 1 + chapters.length) % chapters.length);

  if (!mounted) return null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#f0ede6]">

      {/*GHOST WATERMARK*/}
      <motion.h1
        animate={{ opacity: isExploring ? 0 : 0.15 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8vw] font-black pointer-events-none select-none text-[#8a7f6e] uppercase whitespace-nowrap z-0"
        style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.25em' }}
      >
        Sri Lanka
      </motion.h1>

      <AnimatePresence mode="wait">
        {!isExploring ? (

          /* ── ENTRY STAGE ── */
          <motion.section
            key="hero-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -40,
              filter: 'blur(8px)',
              transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] },
            }}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 z-10"
          >
            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Label */}
              <p
                className="text-[11px] tracking-[0.5em] uppercase text-[#8a7f6e] mb-10 font-sans"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.7s 0.2s, transform 0.7s 0.2s',
                }}
              >
                Untold Sri Lanka
              </p>

              {/* Floating Card */}
              <div
                className="relative z-10"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.94)',
                  transition: 'opacity 0.85s 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.85s 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: mounted ? 'floatCard 4s 1.4s ease-in-out infinite' : 'none',
                }}
              >
                <div
                  className="w-56 sm:w-64 rounded-3xl overflow-hidden"
                  style={{ background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.13)' }}
                >
                  <div className="relative h-40 sm:h-44 overflow-hidden">
                    <Image
                      src="/images/untold-sl.JPEG"
                      alt="Untold Sri Lanka"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 224px, 256px)"
                    />
                    <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                      {['Heritage', 'Coastal'].map((t) => (
                        <span
                          key={t}
                          className="text-[9px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 pt-4">
                    <h3 className="text-lg sm:text-xl leading-snug text-[#1a1a18]" style={{ fontFamily: 'Georgia, serif' }}>
                      Echoes of the{' '}
                      <span className="text-[#0f6e56]">Teal</span>
                      <br />Ocean
                    </h3>
                  </div>

                  {/* ── Featured Story row — no empty circle ── */}
                  <div
                    className="px-4 py-3 mt-3"
                    style={{ borderTop: '1px solid #f0ede6' }}
                  >
                    <p className="text-[9px] uppercase tracking-widest text-[#b0a898] mb-0.5">Featured Story</p>
                    <p className="text-[12px] text-[#3a3530]" style={{ fontFamily: 'Georgia, serif' }}>
                      Sigiriya&apos;s Sky Kingdom
                    </p>
                  </div>
                </div>

                {/* Floating badge — hidden on very small screens */}
                <div
                  className="hidden sm:flex absolute -top-4 -right-14 items-center gap-2 rounded-full px-3 py-2"
                  style={{
                    background: '#fff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '130px',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                    transition: 'opacity 0.5s 1.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s 1.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: '#fff5f0', border: '1.5px solid #f09070' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e05030]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#b0a898]">Active Explorers</p>
                    <p className="text-[15px] font-bold text-[#1a1a18] leading-none">1,204</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div
                className="relative z-10 flex flex-col items-center gap-5 mt-10 sm:mt-14"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.7s 1.0s, transform 0.7s 1.0s',
                }}
              >
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9080] text-center px-4">
                  Immerse yourself in the pearl of the Indian Ocean
                </p>
                <button
                  onClick={() => setIsExploring(true)}
                  className="text-[10px] tracking-[0.18em] uppercase text-white rounded-full px-7 py-4 transition-all hover:scale-105 active:scale-95"
                  style={{ background: '#0f4a3a' }}
                >
                  Start the Journey →
                </button>
              </div>
            </div>

            <style>{`
              @keyframes floatCard {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-10px); }
              }
            `}</style>
          </motion.section>

        ) : (

          /* ── CHAPTER STAGE ── */
          <motion.section
            key="chapter-stage"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full bg-[#0d1a14] text-white flex flex-col overflow-y-auto"
          >
            {/* Background */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentChapter}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="fixed inset-0"
              >
                <Image
                  src={chapters[currentChapter].image}
                  alt={chapters[currentChapter].title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* ── Close button ── */}
            <button
              onClick={() => { setIsExploring(false); setCurrentChapter(0); }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group"
              aria-label="Exit story"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/70">Exit Story</span>
            </button>

            {/* Nav header */}
            <nav className="relative z-20 px-6 sm:px-10 pt-6 sm:pt-10 pb-4 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#2a9a80]">Untold</span>
                <span className="text-[10px] tracking-[0.4em] uppercase opacity-40">Sri Lanka</span>
              </div>

              {/* Chapter pills — desktop only */}
              <div className="hidden md:flex gap-2">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentChapter(i)}
                    className={`text-[9px] tracking-[0.3em] uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                      i === currentChapter
                        ? 'border-[#2a9a80] text-[#2a9a80] bg-[#2a9a80]/10'
                        : 'border-white/10 text-white/30 hover:text-white/60'
                    }`}
                  >
                    {ch.id}
                  </button>
                ))}
              </div>

              <div className="w-10 sm:w-12" />
            </nav>

            {/* Story content */}
            <div className="relative z-20 flex-1 flex flex-col justify-end px-6 sm:px-10 md:px-24 pb-24 sm:pb-28 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">

                {/* Left — chapter identity + narration */}
                <div className="w-full">
                  <motion.div
                    key={`id-${currentChapter}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[11px] sm:text-[13px] tracking-[0.4em] text-[#2a9a80] mb-3 font-bold uppercase"
                  >
                    Chapter {chapters[currentChapter].id}
                  </motion.div>

                  <motion.h2
                    key={`title-${currentChapter}`}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-serif leading-none mb-2"
                  >
                    {chapters[currentChapter].title}
                  </motion.h2>

                  <motion.p
                    key={`subtitle-${currentChapter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-6 sm:mb-8"
                  >
                    {chapters[currentChapter].subtitle}
                  </motion.p>

                  <motion.div
                    key={`narration-${currentChapter}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <NarrationPanel
                      lines={chapters[currentChapter].narration}
                      chapterKey={currentChapter}
                    />
                  </motion.div>

                  {/* Location tags */}
                  <motion.div
                    key={`tags-${currentChapter}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8"
                  >
                    {chapters[currentChapter].locations.map((loc) => (
                      <span
                        key={loc}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 rounded-full text-[9px] uppercase tracking-widest border border-white/10 backdrop-blur-md"
                      >
                        {loc}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Right — nav + progress */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-end gap-6 md:gap-10 mt-6 md:mt-0">
                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={prevChapter}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Previous chapter"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextChapter}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="Next chapter"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="w-40 sm:w-64">
                    <div className="flex justify-between text-[10px] tracking-widest uppercase opacity-40 mb-3">
                      <span>Progression</span>
                      <span>{currentChapter + 1} / {chapters.length}</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/10 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentChapter + 1) / chapters.length) * 100}%` }}
                        className="absolute h-full bg-[#2a9a80]"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}