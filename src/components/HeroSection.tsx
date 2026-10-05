import React from 'react';
import { HackerWorldCanvas } from './hacker-world/HackerWorldCanvas';
import { Terminal, ArrowDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal }) => {
  return (
    <section className="relative w-full min-h-screen bg-[#040507] overflow-hidden select-none flex flex-col justify-between">
      {/* Semantic Crawlable SEO Title Header (Accessible to crawlers and screen readers) */}
      <div className="sr-only">
        <h1>FILTERING ZEROES: ROOTIFYING</h1>
        <p>Born in the 0. Resurrected in the 1.</p>
        <p>A multi-phase technology experience uniting AI, Cybersecurity, Cloud, Web3, and Entrepreneurship.</p>
      </div>

      {/* Main Playable 3D Cyberpunk Hacker World */}
      <div className="relative w-full h-screen min-h-[640px] max-h-[1080px] z-10">
        <HackerWorldCanvas />
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40 border-t border-white/5 bg-[#040507]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playButtonConfirm();
              onOpenTerminal();
            }}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
            data-cursor="access"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>PRESS [~] FOR TERMINAL COMMAND CENTER</span>
          </button>
        </div>

        <a
          href="#about"
          className="flex items-center gap-2 text-white/60 hover:text-cyber-cyan transition-colors animate-bounce cursor-pointer"
          data-cursor="explore"
          onClick={() => sound.playHoverClick()}
        >
          <span>DISCOVER THE ARCHITECTURE</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>

        <div className="text-[11px] text-right hidden sm:block font-mono text-white/40">
          <span>0 &rarr; SIGNAL &rarr; NETWORK &rarr; ROOT &rarr; 1</span>
        </div>
      </div>
    </section>
  );
};
