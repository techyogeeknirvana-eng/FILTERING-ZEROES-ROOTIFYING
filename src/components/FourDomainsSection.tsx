import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Brain, ShieldAlert, Cloud, Rocket, Terminal } from 'lucide-react';

export const FourDomainsSection: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<number>(0);

  const domains = [
    {
      id: 'ai',
      name: 'AI',
      subtitle: 'NEURAL INTELLIGENCE & AUTONOMOUS SYSTEMS',
      color: '#00f0ff',
      accentBg: 'bg-cyber-cyan/10',
      borderColor: 'border-cyber-cyan/40',
      hoverBorder: 'hover:border-cyber-cyan',
      glow: 'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
      image: '/assets/skull/card_ai.jpg',
      pillars: ['Think', 'Create', 'Automate', 'Intelligence'],
      icon: Brain,
      thesis:
        'Moving past surface-level wrapper APIs into sovereign models, multi-agent orchestrations, multimodal vision, and neuro-symbolic reasoning. Discover how autonomous intelligence reshapes systemic velocity.',
      telemetry: [
        { label: 'SYNAPSE DENSITY', val: '98.4 T-FLOP' },
        { label: 'LATENCY PROFILE', val: '12ms SUB-TENSOR' },
        { label: 'AGENTIC DEGREE', val: 'LEVEL 4 AUTONOMY' },
      ],
      codeSnippet: `// Neural Synapse Dispatch
async function synthesizeIntelligence(weights: Tensor): Promise<Signal> {
  const latent = await transformer.project(weights);
  return latent.filterNoise().toResurrectedVector();
}`,
    },
    {
      id: 'cyber',
      name: 'CYBERSECURITY',
      subtitle: 'OFFENSIVE HARDENING & ZERO-TRUST DEFENCE',
      color: '#ff1f43',
      accentBg: 'bg-cyber-red/10',
      borderColor: 'border-cyber-red/40',
      hoverBorder: 'hover:border-cyber-red',
      glow: 'shadow-[0_0_30px_rgba(255,31,67,0.2)]',
      image: '/assets/skull/card_cyber.jpg',
      pillars: ['Break', 'Defend', 'Trace', 'Secure'],
      icon: ShieldAlert,
      thesis:
        'Breaking assumptions before adversaries do. Deep packet inspection, kernel exploitation, reverse engineering, cryptographic zero-knowledge proofs, and sovereign threat surface eradication.',
      telemetry: [
        { label: 'ZERO-DAY THRESHOLD', val: 'RING-0 KERNEL' },
        { label: 'DEFENSE MATRIX', val: 'QUANTUM CRYPTO' },
        { label: 'EXPLOIT RESISTANCE', val: '99.999% INTEGRITY' },
      ],
      codeSnippet: `// Kernel Memory Integrity Probe
int root_privilege_audit(struct cred *cred) {
  if (cred->uid == 0 && cred->euid == 0) {
    return HARDENED_SHIELD_ACTIVE;
  }
  return TRIGGER_ISOLATION_VECTOR();
}`,
    },
    {
      id: 'cloud',
      name: 'CLOUD',
      subtitle: 'HYPERSCALE DISTRIBUTED INFRASTRUCTURE',
      color: '#0070f3',
      accentBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/40',
      hoverBorder: 'hover:border-blue-500',
      glow: 'shadow-[0_0_30px_rgba(0,112,243,0.2)]',
      image: '/assets/skull/card_cloud.jpg',
      pillars: ['Build', 'Scale', 'Deploy', 'Resilience'],
      icon: Cloud,
      thesis:
        'Architecting for fault-tolerant global throughput. Serverless mesh, multi-region failovers, edge computation clusters, and resilient distributed state machines capable of bearing the weight of planetary loads.',
      telemetry: [
        { label: 'EDGE REPLICATION', val: '6 CONTINENTS' },
        { label: 'FAILOVER RTO', val: '< 180ms GLOBALLY' },
        { label: 'CONCURRENCY LOAD', val: '10M+ REQ/SEC' },
      ],
      codeSnippet: `// Global Mesh Dispatcher
apiVersion: apps/v1
kind: SovereignDeployment
metadata:
  name: root-node-cluster
spec:
  replicas: 1024
  regions: [global-anycast]`,
    },
    {
      id: 'entrepreneurship',
      name: 'ENTREPRENEURSHIP',
      subtitle: 'FOUNDER CRAFT & EXPONENTIAL VELOCITY',
      color: '#00e676',
      accentBg: 'bg-brand-green/10',
      borderColor: 'border-brand-green/40',
      hoverBorder: 'hover:border-brand-green',
      glow: 'shadow-[0_0_30px_rgba(0,230,118,0.2)]',
      image: '/assets/skull/card_entrepreneur.jpg',
      pillars: ['Imagine', 'Validate', 'Build', 'Scale'],
      icon: Rocket,
      thesis:
        'Translating deep technology breakthroughs into sustainable sovereign enterprises. From the raw conviction of zero to product-market traction, unit economics, global distribution, and generational category creation.',
      telemetry: [
        { label: 'VALUATION MULTIPLE', val: 'DEEP TECH MOAT' },
        { label: 'GROWTH VECTOR', val: 'EXPONENTIAL COMPOUND' },
        { label: 'MARKET ACCESS', val: 'GLOBAL REACH' },
      ],
      codeSnippet: `// Venture Compounding Equation
const founderVelocity = (insight, executionSpeed) => {
  const moat = Math.pow(technicalDepth, 2);
  return (insight * moat) * Math.exp(executionSpeed);
};`,
    },
  ];

  const current = domains[activeDomain];

  return (
    <section id="domains" className="relative py-28 px-4 sm:px-6 bg-[#06080d] overflow-hidden border-t border-cyber-border/60">
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase">
            <span>MULTIDISCIPLINARY COLLISION</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            THE FOUR <span className="text-cyber-cyan text-glow-cyan">WORLDS</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            NOT SILOED DISCIPLINES — AN UNCOMPROMISING INTERSECTING ECOSYSTEM
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red my-6" />
        </div>

        {/* 4 Cards with Concept Art Integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {domains.map((dom, index) => {
            const isSelected = activeDomain === index;
            const Icon = dom.icon;
            return (
              <div
                key={dom.id}
                onClick={() => {
                  setActiveDomain(index);
                  sound.playDomainReveal(500 + index * 140);
                }}
                className={`relative group cursor-pointer transition-all duration-300 rounded-xl border backdrop-blur-md flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? `${dom.borderColor} ${dom.accentBg} ${dom.glow} -translate-y-2`
                    : 'border-cyber-border/70 bg-cyber-surface/40 hover:border-white/40 hover:-translate-y-1'
                }`}
                data-cursor="explore"
              >
                {/* Artwork Header */}
                <div className="relative h-36 w-full overflow-hidden border-b border-white/10">
                  <img
                    src={dom.image}
                    alt={dom.name}
                    className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 flex items-center justify-between w-[calc(100%-24px)]">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center border"
                      style={{
                        borderColor: dom.color,
                        backgroundColor: `${dom.color}20`,
                        color: dom.color,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white/60 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      [ 0{index + 1} ]
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <h3
                    className="font-display font-black text-2xl tracking-wider uppercase mb-1"
                    style={{ color: isSelected ? dom.color : '#ffffff' }}
                  >
                    {dom.name}
                  </h3>
                  <p className="font-mono text-[10px] text-white/60 tracking-wider mb-4 line-clamp-1">
                    {dom.subtitle}
                  </p>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                    {dom.pillars.map((pillar) => (
                      <div
                        key={pillar}
                        className="px-2 py-1 rounded bg-[#040507]/80 border border-white/5 text-center text-white/80 group-hover:border-white/20 transition-colors"
                      >
                        {pillar}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: dom.color }}
                />
              </div>
            );
          })}
        </div>

        {/* Dossier Expanded Panel */}
        <div className="p-6 sm:p-10 rounded-xl border border-cyber-border bg-cyber-panel/90 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: current.color }}
              />
              <span className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide">
                {current.name} // ARCHITECTURAL DOSSIER
              </span>
            </div>
            <div className="font-mono text-xs text-white/50">
              STATUS: <span style={{ color: current.color }}>ACTIVE TELEMETRY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                {current.thesis}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                {current.telemetry.map((t) => (
                  <div
                    key={t.label}
                    className="p-3 rounded bg-cyber-surface/80 border border-white/10"
                  >
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">
                      {t.label}
                    </div>
                    <div
                      className="text-sm font-bold tracking-tight mt-1"
                      style={{ color: current.color }}
                    >
                      {t.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-4 rounded-lg bg-[#040507] border border-white/10 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px] text-white/40">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyber-cyan" />
                  <span>CORE_DISPATCH_{current.id.toUpperCase()}.sh</span>
                </span>
                <span className="text-brand-green">RUNNING</span>
              </div>
              <pre className="overflow-x-auto text-white/80 text-[11px] leading-relaxed selection:bg-white/20">
                <code>{current.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
