import React from 'react';
import { Crosshair, Navigation } from 'lucide-react';

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="relative py-28 px-4 sm:px-6 bg-[#06080e] overflow-hidden border-t border-cyber-border/60">
      <div className="absolute inset-0 scanline-bg opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-red/40 bg-cyber-red/10 text-cyber-red font-mono text-xs tracking-widest uppercase">
            <Navigation className="w-3.5 h-3.5" />
            <span>PHYSICAL EPICENTER</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            THE <span className="text-cyber-red text-glow-red">VENUE</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            A HIGH-TECH ARENA ENGINEERED FOR LIVE ATTACK-DEFENSE CYBER ENGAGEMENTS & BROADCASTS
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-red to-cyber-cyan my-6" />
        </div>

        <div className="p-8 sm:p-12 rounded-2xl border border-cyber-red/30 bg-cyber-surface/60 backdrop-blur-xl relative overflow-hidden max-w-4xl mx-auto shadow-[0_0_40px_rgba(255,31,67,0.1)]">
          <div className="relative w-full h-64 sm:h-80 rounded-xl bg-[#040507] border border-white/10 flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute w-24 h-24 rounded-full border border-cyber-red/20" />
            <div className="absolute w-48 h-48 rounded-full border border-cyber-red/20" />
            <div className="absolute w-72 h-72 rounded-full border border-cyber-red/15" />
            <div className="absolute w-96 h-96 rounded-full border border-cyber-red/10" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-cyber-red/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-[1px] bg-cyber-red/20" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center origin-center animate-[spin_6s_linear_infinite] pointer-events-none">
              <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent to-cyber-red shadow-[0_0_15px_#ff1f43] translate-x-1/2" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-cyber-red bg-cyber-red/20 flex items-center justify-center animate-pulse">
                <Crosshair className="w-5 h-5 text-cyber-red" />
              </div>
              <span className="font-mono text-xs font-bold text-white tracking-widest bg-black/80 px-2 py-0.5 rounded border border-white/20">
                [ TARGET LOCK PENDING ]
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#040507] border border-white/10 text-center font-mono">
              <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">
                LOCATION
              </div>
              <div className="text-base font-black text-cyber-red tracking-widest uppercase">
                [ CLASSIFIED ]
              </div>
              <div className="text-[10px] text-white/50 mt-1">Geographic Coordinates Encrypted</div>
            </div>

            <div className="p-4 rounded-lg bg-[#040507] border border-white/10 text-center font-mono">
              <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">
                ACCESS
              </div>
              <div className="text-base font-black text-cyber-cyan tracking-widest uppercase">
                [ REVEALING SOON ]
              </div>
              <div className="text-[10px] text-white/50 mt-1">Badge Clearance via Phase 2 Gate</div>
            </div>

            <div className="p-4 rounded-lg bg-[#040507] border border-white/10 text-center font-mono">
              <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">
                CITY
              </div>
              <div className="text-base font-black text-brand-green tracking-widest uppercase">
                [ COMING SOON ]
              </div>
              <div className="text-[10px] text-white/50 mt-1">Metro Tech Hub Announcement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
