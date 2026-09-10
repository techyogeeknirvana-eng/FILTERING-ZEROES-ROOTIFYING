import React from 'react';
import { ArrowUp } from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playBeep(900, 0.03, 0.05);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020305] text-white border-t border-cyber-border/70 py-20 px-4 sm:px-6 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Identity Title */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono font-bold text-sm text-cyber-red">0</span>
          <span className="text-white/30 font-mono">/</span>
          <span className="font-mono font-bold text-sm text-cyber-cyan">1</span>
        </div>

        <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tighter uppercase">
          FILTERING ZEROES:
          <span className="block text-white text-glow-cyan tracking-widest text-2xl sm:text-3xl mt-1">
            ROOTIFYING
          </span>
        </h3>

        {/* Hero Quote */}
        <p className="font-serif italic text-lg sm:text-xl text-white/90 tracking-wide my-4">
          “Born in the 0. Resurrected in the 1.”
        </p>

        {/* Domain Line */}
        <div className="font-mono text-xs tracking-[0.25em] text-white/50 uppercase mb-12">
          AI × CYBER × CLOUD × ENTREPRENEURSHIP
        </div>

        {/* ORGANISED & MANAGED BY - EXACT UPLOADED LOGOS */}
        <div className="w-full max-w-2xl py-8 px-6 rounded-2xl border border-white/10 bg-cyber-surface/40 backdrop-blur-md mb-12">
          <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/50 uppercase mb-8">
            ORGANISED & MANAGED BY
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            {/* TYGN Identity with exact uploaded logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center hover:border-cyber-cyan/50 transition-colors">
                <img
                  src="/assets/logos/tygn-logo.png"
                  alt="TYGN B.Tech Student Community"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white">
                  TYGN
                </div>
                <div className="font-mono text-[11px] text-[#ff9800] tracking-wide font-medium">
                  B.Tech Student Community
                </div>
              </div>
            </div>

            {/* Collision Cross Multiplier */}
            <div className="font-mono text-2xl sm:text-3xl text-white/30 font-thin">
              ×
            </div>

            {/* EventsInfo Identity with exact uploaded logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center hover:border-brand-green/50 transition-colors">
                <img
                  src="/assets/logos/eventsinfo-logo.png"
                  alt="EventsInfo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-display font-extrabold text-sm sm:text-base tracking-wider text-[#00e676]">
                  EventsInfo
                </div>
                <div className="font-mono text-[11px] text-white/50 tracking-wide">
                  Global Event Management
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <div>
            &copy; {new Date().getFullYear()} FILTERING ZEROES: ROOTIFYING. ALL RIGHTS RESERVED.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-cyber-cyan transition-colors"
            data-cursor="access"
          >
            <span>RETURN TO ROOT [0/1]</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
