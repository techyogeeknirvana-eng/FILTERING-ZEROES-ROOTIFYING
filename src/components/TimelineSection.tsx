import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Radio, Hammer, Trophy, Clock } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const total = rect.height;
      const current = windowH - rect.top - 120;
      const progress = Math.min(1, Math.max(0, current / total));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phases = [
    {
      period: 'SEPTEMBER / EARLY OCTOBER',
      phaseTitle: 'SOFT LAUNCH',
      headline: 'THE SIGNAL BEGINS',
      color: '#ff1f43',
      icon: Radio,
      items: [
        'Cinematic Trailer Broadcast',
        'Global Student Community Activation',
        'Early Strategic Announcements',
        'Cryptic Speaker & Mentor Hints',
        'Partner Pre-Registration Verification',
      ],
      dateStatus: 'COMING SOON',
    },
    {
      period: 'OCTOBER → DECEMBER',
      phaseTitle: 'BUILDING THE EXPERIENCE',
      headline: 'FORGING THE ROOT ARCHITECTURE',
      color: '#00f0ff',
      icon: Hammer,
      items: [
        'Community Node Expansions',
        'Keynote Speaker Dossiers Declassified',
        'Sovereign Partner Alliances',
        'Mentor & Judge Cadre Announcements',
        'Classified Venue Coordinates Decrypted',
        'Cross-Campus Collaborations & Challenges Reveal',
      ],
      dateStatus: 'COMING SOON',
    },
    {
      period: 'JANUARY',
      phaseTitle: 'MAIN EVENT',
      headline: 'THE ROOT OPENS',
      color: '#00e676',
      icon: Trophy,
      items: [
        'The Collision: 4-World Symposium',
        'Interactive Filter Zeroes Experience',
        'Top 10 Teams Arena (5 Hackathon + 5 CTF)',
        'Rootify Special: Final Sovereign Tribunal',
        'Ascension: Resurrected in the 1',
      ],
      dateStatus: 'COMING SOON',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-28 px-4 sm:px-6 bg-[#06080e] overflow-hidden border-t border-cyber-border/50"
    >
      <div className="absolute inset-0 scanline-bg opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
            <span>OPERATIONAL TIMELINE</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            ROADMAP TO <span className="text-cyber-cyan text-glow-cyan">ROOT</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            EXACT DATES TO BE ANNOUNCED // ALL MILESTONES OPERATING UNDER HIGH PREPARATION
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red my-6" />
        </div>

        {/* Timeline Container with Progressive Laser Illumination */}
        <div className="relative ml-4 md:ml-32 space-y-12">
          {/* Static Background Guide Line */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 pointer-events-none" />

          {/* Progressive Scroll-Illuminated Line */}
          <div
            className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-cyber-red via-cyber-cyan to-brand-green shadow-[0_0_15px_#00f0ff] -translate-x-1/2 pointer-events-none transition-all duration-150 ease-out"
            style={{ height: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
          />

          {/* Leading Laser Tracer Pulse */}
          <div
            className="absolute left-0 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_20px_#00f0ff] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
            style={{
              top: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
              opacity: scrollProgress > 0.05 && scrollProgress < 0.98 ? 1 : 0,
            }}
          />

          {phases.map((ph, idx) => {
            const Icon = ph.icon;
            const threshold = (idx + 0.3) / phases.length;
            const isIlluminated = scrollProgress >= threshold;

            return (
              <div
                key={ph.period}
                className="relative pl-8 md:pl-12 group"
                data-cursor="explore"
                onMouseEnter={() => sound.playBeep(500 + idx * 100, 0.02, 0.03)}
              >
                <div
                  className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 bg-[#040507] flex items-center justify-center transition-all duration-500 group-hover:scale-125 ${
                    isIlluminated ? 'scale-110 shadow-lg' : 'opacity-70'
                  }`}
                  style={{
                    borderColor: ph.color,
                    boxShadow: isIlluminated ? `0 0 25px ${ph.color}` : `0 0 10px ${ph.color}40`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: ph.color }} />
                </div>

                <div className="md:absolute md:-left-44 md:top-2 md:w-36 md:text-right font-mono text-xs font-bold tracking-wider text-white/50 group-hover:text-white transition-colors mb-2 md:mb-0">
                  {ph.period}
                </div>

                <div
                  className={`p-6 sm:p-8 rounded-xl border transition-all duration-300 backdrop-blur-md ${
                    isIlluminated
                      ? 'border-cyber-cyan/40 bg-cyber-surface/80 shadow-[0_0_30px_rgba(0,240,255,0.1)]'
                      : 'border-cyber-border bg-cyber-surface/60 group-hover:bg-cyber-surface/90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
                    <div>
                      <span className="font-mono text-xs font-bold" style={{ color: ph.color }}>
                        [{ph.phaseTitle}]
                      </span>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wider uppercase mt-1">
                        {ph.headline}
                      </h3>
                    </div>
                    <div className="font-mono text-xs text-white/40 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="border border-white/10 px-2 py-0.5 rounded bg-[#040507]">
                        {ph.dateStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {ph.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm text-white/80 font-mono"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ph.color }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
