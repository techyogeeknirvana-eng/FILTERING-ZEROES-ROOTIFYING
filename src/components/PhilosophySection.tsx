import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { ArrowRight, Filter, GitBranch, Hammer, Globe, Cpu, Radio } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: '0',
      label: '0',
      title: 'THE VOID // ZERO',
      short: 'Possibility',
      color: '#ff1f43',
      description:
        'Everyone sees zero as nothing. We see zero as infinite unallocated potential. The unwritten kernel, the quiet terminal before the first keystroke.',
      detail:
        'Every hacker starts somewhere. Every founder starts with an empty canvas. Every system starts from an uninitialized pointer.',
      icon: Radio,
    },
    {
      id: 'filter',
      label: 'FILTER',
      title: 'THE FILTER // ISOLATION',
      short: 'Signal vs Noise',
      color: '#ff6b35',
      description:
        'In an age of hyper-noise and superficial trends, the elite separate the illusion from the anomaly. You eliminate 99.9% of the static to extract pure truth.',
      detail:
        'Filtering the hype from actual engineering. Discarding noise to locate the critical exploit or the breakthrough product thesis.',
      icon: Filter,
    },
    {
      id: 'root',
      label: 'ROOT',
      title: 'THE ROOT // FIRST PRINCIPLES',
      short: 'Ground Zero',
      color: '#00f0ff',
      description:
        'Going down to privilege ring 0. The foundation of compute, security, and market dynamics. Not solving surface symptoms, but restructuring the root.',
      detail:
        'Root access in Linux. Root directory of a distributed file system. Root cause analysis in incident response. First principles in venture creation.',
      icon: GitBranch,
    },
    {
      id: 'build',
      label: 'BUILD',
      title: 'THE BUILD // SYNTHESIS',
      short: 'System Craft',
      color: '#0070f3',
      description:
        'Ideas are worthless without execution. Crafting robust neural weights, battle-hardened kernels, and scalable microservices that sustain real pressure.',
      detail:
        'Top hackers and architects turn insights into running machines. Not prototypes that break under load, but resilient production architectures.',
      icon: Hammer,
    },
    {
      id: 'impact',
      label: 'IMPACT',
      title: 'THE IMPACT // MOMENTUM',
      short: 'Scale & Resonance',
      color: '#00e676',
      description:
        'Deploying solutions that move beyond local testbeds to safeguard national infrastructure, empower millions, and redefine modern industries.',
      detail:
        'The transition where an individual project alters the velocity of an entire ecosystem. Leaving something permanent that survives the event.',
      icon: Globe,
    },
    {
      id: '1',
      label: '1',
      title: 'THE ONE // RESURRECTION',
      short: 'Creation',
      color: '#00f0ff',
      description:
        'Resurrected in the 1. The binary bit flipped from absence into permanent existence. A fully sovereign, tested, and deployed reality.',
      detail:
        'From zero to one. You began in the darkness of the 0; you emerge in the illuminating radiance of the 1.',
      icon: Cpu,
    },
  ];

  const current = steps[activeStep];
  const IconComponent = current.icon;

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    sound.playBeep(440 + index * 120, 0.04, 0.07);
  };

  return (
    <section id="manifesto" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/40">
      {/* Background scanline & subtle ambient gradients */}
      <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyber-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* About FILTERING ZEROES: ROOTIFYING - Crawlable SEO & Pillar Foundation */}
        <div id="about" className="mb-24">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
              <span>SYSTEM ARCHITECTURE // ABOUT THE EXPERIENCE</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
              ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">FILTERING ZEROES: ROOTIFYING</span>
            </h2>
            <p className="mt-4 text-white/80 font-mono text-xs sm:text-base max-w-3xl leading-relaxed">
              FILTERING ZEROES: ROOTIFYING is a premier multi-phase student technology experience engineered to bridge theoretical knowledge with high-stakes production execution. Uniting future pioneers across AI, Cybersecurity, Cloud, Web3, and Entrepreneurship, it transforms raw individual capability into resilient, sovereign leadership.
            </p>
          </div>

          {/* 5 Core Philosophy Pillars: LEARN, BUILD, COMPETE, CONNECT, GROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* LEARN */}
            <div className="p-5 rounded-xl border border-white/10 bg-cyber-surface/70 hover:border-cyber-cyan/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="font-mono text-xs text-cyber-cyan font-bold tracking-widest mb-1">// PILLAR 01</div>
                <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 group-hover:text-cyber-cyan transition-colors">LEARN</h3>
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Master first principles. From ring-0 kernel architectures to autonomous neural agents and distributed consensus.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-cyber-cyan">
                [ FOUNDATION & DEPTH ]
              </div>
            </div>

            {/* BUILD */}
            <div className="p-5 rounded-xl border border-white/10 bg-cyber-surface/70 hover:border-cyber-red/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="font-mono text-xs text-cyber-red font-bold tracking-widest mb-1">// PILLAR 02</div>
                <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 group-hover:text-cyber-red transition-colors">BUILD</h3>
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Transform concepts into hardened battle systems. Engineer scalable architectures capable of sustaining real-world load.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-cyber-red">
                [ PRODUCTION SYNTHESIS ]
              </div>
            </div>

            {/* COMPETE */}
            <div className="p-5 rounded-xl border border-white/10 bg-cyber-surface/70 hover:border-yellow-400/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="font-mono text-xs text-yellow-400 font-bold tracking-widest mb-1">// PILLAR 03</div>
                <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 group-hover:text-yellow-400 transition-colors">COMPETE</h3>
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Test your mettle in elite Hackathon crucibles and intense CTF war rooms. The arena where theory faces adversarial pressure.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-yellow-400">
                [ TOURNAMENT CRUCIBLE ]
              </div>
            </div>

            {/* CONNECT */}
            <div className="p-5 rounded-xl border border-white/10 bg-cyber-surface/70 hover:border-purple-400/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="font-mono text-xs text-purple-400 font-bold tracking-widest mb-1">// PILLAR 04</div>
                <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 group-hover:text-purple-400 transition-colors">CONNECT</h3>
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Build high-conviction alliances across student communities, engineering mentors, founders, and industry leaders.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-purple-400">
                [ STRATEGIC NETWORK ]
              </div>
            </div>

            {/* GROW */}
            <div className="p-5 rounded-xl border border-white/10 bg-cyber-surface/70 hover:border-brand-green/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="font-mono text-xs text-brand-green font-bold tracking-widest mb-1">// PILLAR 05</div>
                <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 group-hover:text-brand-green transition-colors">GROW</h3>
                <p className="font-mono text-xs text-white/70 leading-relaxed">
                  Elevate professional etiquette, verbal communication, and venture execution. Resurrected from raw 0 into sovereign 1.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-brand-green">
                [ ASCENSION & RESURRECTION ]
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-red/40 bg-cyber-red/10 text-cyber-red font-mono text-xs tracking-widest uppercase">
            <span>PHILOSOPHY // FIRST PRINCIPLES</span>
          </div>
          <h3 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            WHY <span className="text-cyber-red text-glow-red">ZERO?</span>
          </h3>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-red to-cyber-cyan my-6" />
        </div>

        {/* Manifesto Quote Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-6 space-y-6 text-lg sm:text-xl text-white/80 font-light leading-relaxed">
            <p className="border-l-2 border-cyber-red pl-4 py-1 text-white font-medium">
              “Everyone sees zero as nothing.<br />
              <span className="text-cyber-cyan font-bold">We see zero as possibility.</span>”
            </p>
            <p className="text-white/70 text-base sm:text-lg">
              Every hacker starts somewhere.<br />
              Every founder starts with an idea.<br />
              Every system starts from an empty architecture.<br />
              Every breakthrough starts with a question.
            </p>
            <p className="border-l-2 border-cyber-cyan pl-4 py-1 text-white/90 text-base sm:text-lg italic font-serif">
              “Filtering Zeroes is about filtering the noise, finding the signal, going to the root, and turning possibility into impact.”
            </p>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-lg border border-cyber-border bg-cyber-surface/60 backdrop-blur-md relative">
            <div className="absolute top-3 right-4 font-mono text-[10px] text-white/40 tracking-wider">
              [ MANIFESTO // SYSTEM_LOG ]
            </div>
            <div className="font-mono text-xs text-cyber-cyan/80 space-y-2 mb-4">
              <p>&gt; RUN sys.manifesto_verify()</p>
              <p className="text-white/60">&gt; ZERO_STATE: Initialized (100% Potential)</p>
              <p className="text-cyber-red">&gt; NOISE_FILTER: Active (Filtering Entropy)</p>
              <p className="text-brand-green">&gt; ROOT_ACCESS: Granted</p>
            </div>
            <div className="p-4 rounded bg-[#040507]/90 border border-white/10 font-mono text-xs sm:text-sm text-white/90 leading-relaxed">
              <span className="text-cyber-red font-bold">0</span> is the crucible. <br />
              <span className="text-cyber-cyan font-bold">1</span> is the resonance. <br />
              The transformation between them is called <span className="text-white font-extrabold uppercase underline decoration-cyber-cyan decoration-2">ROOTIFYING</span>.
            </div>
          </div>
        </div>

        {/* Interactive Transformation Machine: 0 -> FILTER -> ROOT -> BUILD -> IMPACT -> 1 */}
        <div className="p-6 sm:p-10 rounded-xl border border-cyber-border bg-cyber-panel/80 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyber-border">
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-white/70">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              <span>INTERACTIVE TRANSFORMATION PIPELINE</span>
            </div>
            <span className="font-mono text-xs text-white/40">
              CLICK OR SCRUB THROUGH STAGES
            </span>
          </div>

          {/* Pipeline Scrubber Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={`py-3 px-2 rounded font-mono text-xs font-bold tracking-wider transition-all flex flex-col items-center gap-1 border ${
                    isSelected
                      ? 'border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-105'
                      : 'border-cyber-border bg-cyber-surface/40 text-white/60 hover:text-white hover:border-white/30'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${step.color}22` : undefined,
                    borderColor: isSelected ? step.color : undefined,
                  }}
                  data-cursor="access"
                >
                  <span className="text-xs opacity-50">0{idx + 1}</span>
                  <span className="text-sm font-black" style={{ color: step.color }}>
                    {step.label}
                  </span>
                  <span className="text-[10px] font-normal text-white/50 truncate max-w-full">
                    {step.short}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Dynamic Telemetry Card */}
          <div className="p-6 sm:p-8 rounded-lg bg-cyber-surface/90 border border-white/10 relative overflow-hidden transition-all duration-300">
            {/* Top color indicator bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
              style={{ backgroundColor: current.color }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center border shadow-lg"
                  style={{
                    backgroundColor: `${current.color}15`,
                    borderColor: current.color,
                    color: current.color,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-xs tracking-widest uppercase opacity-60">
                    STAGE {activeStep + 1} OF 6
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-white tracking-wide">
                    {current.title}
                  </h3>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  disabled={activeStep === 0}
                  onClick={() => handleStepClick(Math.max(0, activeStep - 1))}
                  className="px-3 py-1.5 rounded border border-cyber-border disabled:opacity-30 hover:border-white/40 transition-colors"
                >
                  &larr; PREV
                </button>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => handleStepClick(Math.min(steps.length - 1, activeStep + 1))}
                  className="px-3 py-1.5 rounded border border-cyber-border disabled:opacity-30 hover:border-white/40 transition-colors flex items-center gap-1"
                >
                  <span>NEXT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p className="text-lg text-white/90 leading-relaxed mb-4">
              {current.description}
            </p>
            <div className="p-4 rounded bg-[#040507] border border-white/5 font-mono text-xs text-white/70">
              <span className="text-cyber-cyan font-bold">&gt;&gt; CONTEXT: </span>
              {current.detail}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
