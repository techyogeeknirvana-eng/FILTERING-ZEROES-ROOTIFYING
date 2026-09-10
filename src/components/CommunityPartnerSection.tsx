import React from 'react';
import { sound } from '../utils/audio';
import { ExternalLink, Users, ShieldCheck, Award, Network, Globe } from 'lucide-react';

export const CommunityPartnerSection: React.FC = () => {
  const partnerPerks = [
    {
      title: 'COMMUNITY EXPANSION',
      desc: 'Empower your members with priority access to keynote sessions and multi-domain problem spaces.',
      icon: Network,
    },
    {
      title: 'CO-BRANDED RECOGNITION',
      desc: 'Official partner placement across global broadcasts, communications, and live tournament arenas.',
      icon: Award,
    },
    {
      title: 'ROOTIFY TOURNAMENT PIPELINE',
      desc: 'Direct qualifying pathways for your premier hackers and developers into the Top 10 Grand Finale.',
      icon: ShieldCheck,
    },
    {
      title: 'ECOSYSTEM COLLISION',
      desc: 'Connect your builders with industry veterans, founders, and cross-campus engineering collectives.',
      icon: Globe,
    },
  ];

  const handlePartnerClick = () => {
    sound.playBeep(980, 0.05, 0.08);
  };

  return (
    <section id="partner" className="relative py-28 px-4 sm:px-6 bg-[#06080e] overflow-hidden border-t border-cyber-border/60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyber-red/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="p-8 sm:p-14 rounded-2xl border-2 border-cyber-red/50 bg-gradient-to-b from-cyber-panel/90 to-[#040507] backdrop-blur-xl shadow-[0_0_50px_rgba(255,31,67,0.2)] text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded border border-cyber-red bg-cyber-red/10 text-cyber-red font-mono text-xs tracking-widest uppercase font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY ALLIANCE INITIATIVE</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none">
            BECOME A <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">
              COMMUNITY PARTNER
            </span>
          </h2>

          <p className="font-serif italic text-2xl sm:text-3xl text-white/90 tracking-wide max-w-3xl mx-auto my-8 leading-relaxed">
            “Help us take this experience beyond one campus, one city or one community.”
          </p>

          <p className="text-sm sm:text-base text-white/60 font-mono max-w-2xl mx-auto mb-10">
            Whether you lead a college computing society, a student developer chapter, an underground CTF team, or an AI research club—join us in establishing the sovereign root.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://docs.google.com/forms/d/1lDHES3lIdxrCKSNH2Ue-k2s26zMMcTSl4P0aloMZp80/edit"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePartnerClick}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-lg bg-cyber-red hover:bg-cyber-red-dark text-white font-mono font-black text-sm sm:text-base tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(255,31,67,0.4)] hover:shadow-[0_0_45px_rgba(255,31,67,0.7)] hover:scale-105"
              data-cursor="enter"
            >
              <span>REGISTER AS COMMUNITY PARTNER</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="mt-4 font-mono text-[11px] text-white/40 tracking-wider">
            [ OPENS VERIFIED OFFICIAL REGISTRATION PORTAL IN A SECURE TAB ]
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {partnerPerks.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-xl border border-cyber-border bg-cyber-surface/50 backdrop-blur-sm flex flex-col justify-between"
                data-cursor="explore"
              >
                <div>
                  <div className="w-10 h-10 rounded flex items-center justify-center border border-white/10 bg-white/5 text-cyber-cyan mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs font-mono text-white/60 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
