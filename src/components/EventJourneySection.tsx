import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Radio, Users, Sparkles, Filter, Terminal, Award } from 'lucide-react';

export const EventJourneySection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      step: '01',
      code: 'STAGE_SIGNAL',
      title: 'THE SIGNAL',
      badge: 'PROLOGUE',
      color: '#ff1f43',
      icon: Radio,
      summary: 'The beginning. The mystery. The first clue.',
      description:
        'A cryptic transmission broadcasts across student networks, hacker servers, and developer ecosystems. Cryptographic clues, hidden repo commits, and early puzzles test who is perceptive enough to heed the signal before mainstream awareness.',
      deliverable: 'Cryptographic CTF Flag · Community Key Distribution',
    },
    {
      step: '02',
      code: 'STAGE_MINDS',
      title: 'THE MINDS',
      badge: 'KEYNOTE ARSENAL',
      color: '#00f0ff',
      icon: Users,
      summary: 'Powerful speaker sessions.',
      description:
        'Founders, kernel developers, security researchers, and AI architects take the central stage. No surface-level motivation—raw frontline technical breakdowns, war stories, zero-day discoveries, and sovereign scaling playbooks.',
      deliverable: 'Technical Deep Dives · Architecture Dissections',
    },
    {
      step: '03',
      code: 'STAGE_COLLISION',
      title: 'THE COLLISION',
      badge: '4-WORLD COMBAT',
      color: '#ff9800',
      icon: Sparkles,
      summary:
        'AI + Cyber + Cloud + Entrepreneurship experts attack one real-world problem from different perspectives.',
      deliverable: 'Cross-Disciplinary Live Synthesis · Multi-Angle Solution Matrix',
      description:
        'A high-stakes cross-domain clash. A single monolithic catastrophe or planetary dilemma is presented. AI specialists propose model inference; cyber architects audit the threat vectors; cloud engineers ensure distributed failovers; founders build the economic viability.',
    },
    {
      step: '04',
      code: 'STAGE_FILTER',
      title: 'FILTER ZEROES',
      badge: 'THE CRUCIBLE',
      color: '#ff1f43',
      icon: Filter,
      summary: 'Interactive thinking and problem-solving experience.',
      description:
        'Participants face intense, rapid-fire scenario challenges designed to strip away superficial noise. Teams must isolate root causes under stringent time constraints, demonstrating rigorous first-principles reasoning.',
      deliverable: 'Elimination Round · Real-time Dynamic Scoreboard',
    },
    {
      step: '05',
      code: 'STAGE_ROOTIFY',
      title: 'ROOTIFY',
      badge: 'THE ARENA',
      color: '#0070f3',
      icon: Terminal,
      summary: 'The ultimate hybrid challenge.',
      description:
        'Top 5 Hackathon Teams + Top 5 CTF Teams enter the arena simultaneously. A unified battleground where defensive coding, offensive pen-testing, generative agents, and cloud resilience are tested in real time.',
      deliverable: 'Live Attack-Defense Arena · Functional Prototype Deployment',
    },
    {
      step: '06',
      code: 'STAGE_SPECIAL',
      title: 'ROOTIFY SPECIAL',
      badge: 'ELITE ASCENSION',
      color: '#00e676',
      icon: Award,
      summary: 'The final elite round.',
      description:
        'The absolute finalists face the ultimate trial before a tribunal of industry legends. They must withstand live kernel injection attacks, systemic scale surges, and investor stress audits to be crowned the sovereign champions.',
      deliverable: 'Grand Crown · Permanent Induction into Rootify Vanguard',
    },
  ];

  const current = stages[activeStage];
  const Icon = current.icon;

  return (
    <section id="experience" className="relative py-28 px-4 sm:px-6 bg-[#06080e] overflow-hidden border-t border-cyber-border/40">
      <div id="journey" className="absolute -top-24 pointer-events-none" />
      <div className="absolute inset-0 scanline-bg opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
            <span>THE EVENT JOURNEY</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            EVENT <span className="text-cyber-cyan text-glow-cyan">EXPERIENCE</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            A PROGRESSIVE 6-STAGE ODYSSEY FROM THE FIRST HIDDEN TRANSMISSION TO THE ELITE TRIBUNAL
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red my-6" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {stages.map((st, idx) => {
            const isSelected = activeStage === idx;
            const StIcon = st.icon;
            return (
              <button
                key={st.code}
                onClick={() => {
                  setActiveStage(idx);
                  sound.playBeep(520 + idx * 80, 0.03, 0.05);
                }}
                className={`p-4 rounded border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-white bg-cyber-surface shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-102'
                    : 'border-cyber-border bg-[#040507]/60 text-white/60 hover:text-white hover:border-white/30'
                }`}
                style={{
                  borderTopColor: isSelected ? st.color : undefined,
                  borderTopWidth: isSelected ? '3px' : undefined,
                }}
                data-cursor="access"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold" style={{ color: st.color }}>
                    {st.step}
                  </span>
                  <StIcon className="w-4 h-4 opacity-70" />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-white/40 tracking-wider">
                    {st.badge}
                  </div>
                  <div className="font-display font-bold text-sm tracking-wide text-white mt-0.5">
                    {st.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-10 rounded-xl border border-cyber-border bg-cyber-panel/90 backdrop-blur-xl relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-cyber-border">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center border shadow-lg"
                style={{
                  backgroundColor: `${current.color}15`,
                  borderColor: current.color,
                  color: current.color,
                }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold tracking-widest text-white/50">
                    STAGE // {current.step}
                  </span>
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold"
                    style={{
                      backgroundColor: `${current.color}20`,
                      color: current.color,
                    }}
                  >
                    {current.badge}
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wider uppercase mt-1">
                  {current.title}
                </h3>
              </div>
            </div>

            <div className="font-mono text-xs text-white/50 text-left lg:text-right">
              <div>PROTOCOL CODE: <span className="text-white font-bold">{current.code}</span></div>
              <div className="mt-1 text-cyber-cyan">&gt; HYBRID INTEGRATION PIPELINE</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="text-xl font-medium text-white/90 border-l-2 pl-4" style={{ borderColor: current.color }}>
                {current.summary}
              </div>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light">
                {current.description}
              </p>
            </div>

            <div className="lg:col-span-4 p-5 rounded-lg bg-cyber-surface/90 border border-white/10 font-mono text-xs space-y-3">
              <div className="text-[10px] text-white/40 tracking-wider uppercase">
                [ STAGE OUTPUT & CRITERIA ]
              </div>
              <div className="text-sm font-semibold text-white">
                {current.deliverable}
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] text-white/60 space-y-1">
                <div>&bull; Multidisciplinary evaluation</div>
                <div>&bull; Live audience telemetry</div>
                <div>&bull; Direct mentor pressure test</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
