import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Lock } from 'lucide-react';

export const SpeakersSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const speakerSlots = [
    {
      id: 'sp-1',
      domain: 'AI',
      role: 'FOUNDATION MODEL ARCHITECT',
      color: '#00f0ff',
      hash: '0x9B2A...E47C',
      status: 'REVEALING SOON',
    },
    {
      id: 'sp-2',
      domain: 'CYBER',
      role: 'RING-0 EXPLOIT RESEARCHER',
      color: '#ff1f43',
      hash: '0x3F81...A92D',
      status: 'CLASSIFIED',
    },
    {
      id: 'sp-3',
      domain: 'CLOUD',
      role: 'GLOBAL INFRASTRUCTURE PRINCIPAL',
      color: '#0070f3',
      hash: '0x88CC...F110',
      status: 'REVEALING SOON',
    },
    {
      id: 'sp-4',
      domain: 'ENTREPRENEURSHIP',
      role: 'DEEP-TECH UNICORN FOUNDER',
      color: '#00e676',
      hash: '0x1A4D...33B9',
      status: 'CLASSIFIED',
    },
    {
      id: 'sp-5',
      domain: 'AI',
      role: 'AUTONOMOUS AGENT RESEARCHER',
      color: '#00f0ff',
      hash: '0x7E34...C021',
      status: 'COMING SOON',
    },
    {
      id: 'sp-6',
      domain: 'CYBER',
      role: 'DEFENSIVE SEC-OPS DIRECTOR',
      color: '#ff1f43',
      hash: '0x4D12...89FA',
      status: 'REVEALING SOON',
    },
    {
      id: 'sp-7',
      domain: 'CLOUD',
      role: 'SERVERLESS MESH PIONEER',
      color: '#0070f3',
      hash: '0x22B0...65EF',
      status: 'COMING SOON',
    },
    {
      id: 'sp-8',
      domain: 'ENTREPRENEURSHIP',
      role: 'GLOBAL VENTURE PARTNER',
      color: '#00e676',
      hash: '0x00A1...DEAD',
      status: 'CLASSIFIED',
    },
  ];

  const filteredSlots =
    activeFilter === 'ALL'
      ? speakerSlots
      : speakerSlots.filter((s) => s.domain === activeFilter);

  const filters = ['ALL', 'AI', 'CYBER', 'CLOUD', 'ENTREPRENEURSHIP'];

  return (
    <section id="speakers" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/50">
      <div className="absolute inset-0 scanline-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
            <span>KEYNOTE ARCHITECTS</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            THE <span className="text-cyber-cyan text-glow-cyan">MINDS</span>
          </h2>
          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-white/90 tracking-wide max-w-2xl">
            “Four worlds. One stage. Questions that don't have easy answers.”
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red my-6" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                sound.playBeep(800, 0.02, 0.03);
              }}
              className={`px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all border ${
                activeFilter === f
                  ? 'border-white text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'border-cyber-border bg-cyber-surface/40 text-white/60 hover:text-white hover:border-white/30'
              }`}
              data-cursor="access"
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSlots.map((sp) => (
            <div
              key={sp.id}
              className="group relative p-6 rounded-lg border border-cyber-border bg-cyber-surface/40 hover:bg-cyber-surface/80 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col justify-between min-h-[320px]"
              data-cursor="locked"
              onClick={() => sound.playDenied()}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none" />

              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[11px] font-bold px-2 py-0.5 rounded uppercase"
                  style={{
                    backgroundColor: `${sp.color}15`,
                    color: sp.color,
                    border: `1px solid ${sp.color}40`,
                  }}
                >
                  {sp.domain}
                </span>
                <span className="font-mono text-[10px] text-white/30">{sp.hash}</span>
              </div>

              <div className="my-6 flex flex-col items-center justify-center py-4">
                <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-cyber-panel/60 group-hover:border-cyber-red/50 transition-colors relative">
                  <Lock className="w-8 h-8 text-white/40 group-hover:text-cyber-red transition-colors" />
                  <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                </div>
                <div className="mt-4 font-display font-bold text-lg text-white tracking-widest uppercase">
                  COMING SOON
                </div>
                <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase mt-1">
                  {sp.role}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-white/40">[ ENCRYPTION: SHA-256 ]</span>
                <span
                  className="font-bold tracking-wider"
                  style={{ color: sp.color }}
                >
                  [{sp.status}]
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
