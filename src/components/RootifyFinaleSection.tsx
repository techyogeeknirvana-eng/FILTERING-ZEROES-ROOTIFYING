import React from 'react';
import { sound } from '../utils/audio';
import { Flame } from 'lucide-react';

export const RootifyFinaleSection: React.FC = () => {
  const pipeline = [
    { step: 'THINK', color: '#00f0ff', desc: 'Isolate First Principles' },
    { step: 'BREAK', color: '#ff1f43', desc: 'Penetrate Attack Vectors' },
    { step: 'BUILD', color: '#0070f3', desc: 'Deploy Battle Systems' },
    { step: 'DEFEND', color: '#ff1f43', desc: 'Kernel Zero-Trust Shield' },
    { step: 'SCALE', color: '#00f0ff', desc: 'Multi-Region Throughput' },
    { step: 'CREATE', color: '#00e676', desc: 'Generational Market Impact' },
  ];

  const pillars = [
    'Critical Thinking',
    'Offensive CTF',
    'Cybersecurity',
    'Full-Stack Building',
    'Autonomous AI',
    'Resilient Cloud',
    'Live Defence',
    'Venture Economics',
    'Strategic Decision-Making',
  ];

  return (
    <section id="rootify" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-red/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 hud-dots opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 rounded border border-cyber-red bg-cyber-red/15 text-cyber-red font-mono text-xs tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(255,31,67,0.3)]">
            <Flame className="w-3.5 h-3.5 text-cyber-red animate-pulse" />
            <span>THE PINNACLE ARENA</span>
          </div>
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl text-white tracking-tighter uppercase leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">
              ROOTIFY
            </span>
          </h2>
          <p className="mt-4 font-display font-extrabold text-lg sm:text-2xl text-white tracking-[0.25em] uppercase text-glow-red">
            THE GAME WHERE WORLDS COLLIDE
          </p>
          <div className="w-20 h-[3px] bg-gradient-to-r from-cyber-red via-white to-cyber-cyan my-6" />
        </div>

        <div className="p-8 sm:p-12 rounded-2xl border border-cyber-red/40 bg-cyber-surface/70 backdrop-blur-xl relative overflow-hidden mb-16 shadow-[0_0_40px_rgba(255,31,67,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center">
            <div className="md:col-span-4 p-6 rounded-xl border border-cyber-cyan/40 bg-cyber-cyan/10 flex flex-col items-center">
              <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase font-bold mb-2">
                HACKATHON CRUCIBLE
              </span>
              <span className="font-display font-black text-4xl sm:text-5xl text-white">
                TOP 5
              </span>
              <span className="font-mono text-xs text-white/60 uppercase mt-2">
                ELITE BUILDERS & ARCHITECTS
              </span>
            </div>

            <div className="md:col-span-1 flex items-center justify-center font-display font-black text-3xl text-white/50">
              +
            </div>

            <div className="md:col-span-4 p-6 rounded-xl border border-cyber-red/40 bg-cyber-red/10 flex flex-col items-center">
              <span className="font-mono text-xs text-cyber-red tracking-widest uppercase font-bold mb-2">
                CTF ARENA
              </span>
              <span className="font-display font-black text-4xl sm:text-5xl text-white">
                TOP 5
              </span>
              <span className="font-mono text-xs text-white/60 uppercase mt-2">
                ELITE OFFENSIVE & DEFENSIVE HACKERS
              </span>
            </div>

            <div className="md:col-span-3 p-6 rounded-xl border-2 border-white bg-white/10 flex flex-col items-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span className="font-mono text-xs text-white/80 tracking-widest uppercase font-bold mb-2">
                THE FINAL ARENA
              </span>
              <span className="font-display font-black text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyber-red to-cyber-cyan">
                10
              </span>
              <span className="font-mono text-xs font-bold text-white uppercase mt-2 tracking-widest">
                TEAMS
              </span>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center font-mono text-xs tracking-widest text-white/60 uppercase mb-8">
            [ SYSTEMIC PROGRESSION SEQUENCE ]
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipeline.map((p, idx) => (
              <div
                key={p.step}
                className="p-4 rounded-lg border border-cyber-border bg-cyber-panel flex flex-col items-center text-center transition-transform hover:-translate-y-1"
                data-cursor="explore"
                onMouseEnter={() => sound.playBeep(400 + idx * 100, 0.02, 0.03)}
              >
                <div className="font-mono text-[10px] text-white/40 mb-1">0{idx + 1}</div>
                <div
                  className="font-display font-black text-xl tracking-wider uppercase mb-1"
                  style={{ color: p.color }}
                >
                  {p.step}
                </div>
                <div className="text-[11px] font-mono text-white/60">
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-xl border border-white/15 bg-gradient-to-b from-cyber-panel to-[#040507] text-center max-w-4xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {pillars.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1 rounded bg-[#040507] border border-white/10 font-mono text-xs text-white/80"
              >
                {pill}
              </span>
            ))}
          </div>

          <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
            “The winner is not simply the best hacker or the best developer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan font-extrabold uppercase">
              The winner must understand the whole system.
            </span>”
          </p>

          <p className="text-sm sm:text-base text-white/60 font-mono max-w-2xl mx-auto">
            When your code is injected under live pressure, when your cloud region experiences cascading latency, and when you must present the economic viability to sovereign investors—only those rooted in all dimensions will stand.
          </p>
        </div>
      </div>
    </section>
  );
};
