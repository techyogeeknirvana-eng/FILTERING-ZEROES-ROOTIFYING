import React from 'react';
import { Users, Zap, Wrench, ShieldX, Network, Sparkles, Rocket } from 'lucide-react';
import { sound } from '../utils/audio';

export const WhyRootifySection: React.FC = () => {
  const statements = [
    {
      num: '01',
      title: 'MEET THE MINDS',
      subtitle: 'Connect with experts, builders, founders and innovators.',
      color: '#00f0ff',
      icon: Users,
    },
    {
      num: '02',
      title: 'LEARN FROM THE FRONTLINE',
      subtitle: 'Real-world insights across AI, cybersecurity, cloud and entrepreneurship.',
      color: '#ff1f43',
      icon: Zap,
    },
    {
      num: '03',
      title: 'BUILD',
      subtitle: 'Turn ideas into real systems and products.',
      color: '#00e676',
      icon: Wrench,
    },
    {
      num: '04',
      title: 'BREAK',
      subtitle: 'Challenge assumptions and discover weaknesses.',
      color: '#ff1f43',
      icon: ShieldX,
    },
    {
      num: '05',
      title: 'CONNECT',
      subtitle: 'Meet communities, students, professionals, mentors and industry leaders.',
      color: '#0070f3',
      icon: Network,
    },
    {
      num: '06',
      title: 'DISCOVER OPPORTUNITIES',
      subtitle: 'Find collaborators, mentors, partners, internships, projects and startup opportunities.',
      color: '#ff9800',
      icon: Sparkles,
    },
    {
      num: '07',
      title: 'CREATE IMPACT',
      subtitle: 'Leave with something that exists beyond the event.',
      color: '#00f0ff',
      icon: Rocket,
    },
  ];

  return (
    <section id="why-rootify" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/40">
      <div className="absolute inset-0 scanline-bg opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyber-red/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-red/40 bg-cyber-red/10 text-cyber-red font-mono text-xs tracking-widest uppercase">
            <span>THE PURPOSE</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            WHY <span className="text-cyber-red text-glow-red">ROOTIFY?</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            NOT ANOTHER PASSIVE AUDIENCE CONGREGATION. AN IMMERSIVE CATALYST FOR BUILDERS.
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-red to-cyber-cyan my-6" />
        </div>

        <div className="space-y-4">
          {statements.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.title}
                className="group relative p-6 sm:p-8 rounded-xl border border-cyber-border/80 bg-cyber-surface/40 hover:bg-cyber-surface/90 transition-all duration-300 backdrop-blur-md overflow-hidden"
                data-cursor="explore"
                onMouseEnter={() => sound.playBeep(600 + i * 80, 0.02, 0.04)}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
                  style={{ backgroundColor: st.color }}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <span
                      className="font-mono text-lg sm:text-2xl font-black transition-colors"
                      style={{ color: st.color }}
                    >
                      {st.num}
                    </span>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center border transition-all"
                        style={{
                          borderColor: `${st.color}50`,
                          backgroundColor: `${st.color}15`,
                          color: st.color,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-wide uppercase group-hover:text-glow-cyan transition-all">
                        {st.title}
                      </h3>
                    </div>
                  </div>

                  <div className="md:max-w-md text-sm sm:text-base text-white/70 font-light group-hover:text-white transition-colors pl-12 md:pl-0">
                    {st.subtitle}
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
