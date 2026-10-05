import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Lock, Terminal, Radio, Compass } from 'lucide-react';

interface ModuleCard {
  id: string;
  name: string;
  code: string;
  initialStatus: 'CLASSIFIED' | 'REVEALING SOON' | 'ACCESS PENDING';
  iconType: string;
  color: string;
  meta: string;
}

export const CommandCenterSection: React.FC = () => {
  const initialModules: ModuleCard[] = [
    {
      id: 'reg',
      name: 'REGISTER NOW',
      code: 'AUTH_GATEWAY_V1',
      initialStatus: 'ACCESS PENDING',
      iconType: 'gate',
      color: '#00f0ff',
      meta: 'Candidate verification portal and security clearance protocols.',
    },
    {
      id: 'mentors',
      name: 'MENTORS',
      code: 'ROOT_CADRE',
      initialStatus: 'CLASSIFIED',
      iconType: 'cadre',
      color: '#ff1f43',
      meta: 'Senior researchers, distinguished founders, and defense specialists.',
    },
    {
      id: 'colleges',
      name: 'COLLEGES',
      code: 'ACADEMIC_GRID',
      initialStatus: 'CLASSIFIED',
      iconType: 'grid',
      color: '#0070f3',
      meta: 'Premier institutional chapters and university engineering cohorts.',
    },
    {
      id: 'guests',
      name: 'GUESTS',
      code: 'DIGNITARY_LIST',
      initialStatus: 'CLASSIFIED',
      iconType: 'dignitary',
      color: '#00e676',
      meta: 'Ecosystem luminaries, policy delegates, and technology pioneers.',
    },
    {
      id: 'speakers',
      name: 'SPEAKERS',
      code: 'VOX_ORATORS',
      initialStatus: 'REVEALING SOON',
      iconType: 'speakers',
      color: '#00f0ff',
      meta: 'Multidisciplinary minds addressing uncompromised industry problems.',
    },
    {
      id: 'venue',
      name: 'VENUE',
      code: 'GEOLOC_COORDINATES',
      initialStatus: 'CLASSIFIED',
      iconType: 'geo',
      color: '#ff1f43',
      meta: 'State-of-the-art arena infrastructure and broadcast command hub.',
    },
    {
      id: 'partners',
      name: 'PARTNERS',
      code: 'ALLIANCE_CONSORTIUM',
      initialStatus: 'REVEALING SOON',
      iconType: 'alliance',
      color: '#00f0ff',
      meta: 'Global tech ecosystems, student alliances, and community hubs.',
    },
    {
      id: 'sponsors',
      name: 'SPONSORS',
      code: 'CAPITAL_BACKERS',
      initialStatus: 'CLASSIFIED',
      iconType: 'capital',
      color: '#ff9800',
      meta: 'Industry leaders underwriting the sovereign technology arena.',
    },
    {
      id: 'communities',
      name: 'COMMUNITIES',
      code: 'FEDERATED_NODES',
      initialStatus: 'ACCESS PENDING',
      iconType: 'nodes',
      color: '#00e676',
      meta: 'Grassroot hacker guilds, AI builder rings, and student collectives.',
    },
    {
      id: 'challenges',
      name: 'CHALLENGES',
      code: 'CTF_EXPLOIT_SUITE',
      initialStatus: 'CLASSIFIED',
      iconType: 'exploit',
      color: '#ff1f43',
      meta: 'Multi-layer attack-defense challenges and full-stack battle scenarios.',
    },
  ];

  const [cardStates, setCardStates] = useState<Record<string, 'idle' | 'authenticating' | 'encrypted' | 'denied'>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> SYSTEM READY. ENCRYPTED COMMAND HUB ACTIVE.',
    '> SELECT ANY CLASSIFIED NODE TO ATTEMPT CLEARANCE OR LOCATE ON 3D NETWORK.',
  ]);

  const locateOn3DNetwork = (modId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playNavWhoosh();
    window.dispatchEvent(new CustomEvent('fz:command-card-select', { detail: { moduleId: modId } }));
  };

  const handleCardClick = (mod: ModuleCard) => {
    if (mod.id === 'reg') {
      sound.playButtonConfirm();
      const el = document.getElementById('access');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const currentState = cardStates[mod.id] || 'idle';
    if (currentState === 'authenticating') return;

    setCardStates((prev) => ({ ...prev, [mod.id]: 'authenticating' }));
    sound.playNodeDetected();

    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [
      `> [${timestamp}] PROBE TARGET: node://${mod.id.toLowerCase()}`,
      `> INITIATING HANDSHAKE: ${mod.code}... [STANDBY]`,
      ...prev.slice(0, 6),
    ]);

    setTimeout(() => {
      setCardStates((prev) => ({ ...prev, [mod.id]: 'encrypted' }));
      sound.playNodeScanning();
      setTerminalLogs((prev) => [
        `> PROTOCOL: RSA-4096 / SHA-256 SIGNATURE ENCRYPTED`,
        ...prev.slice(0, 6),
      ]);
    }, 550);

    setTimeout(() => {
      setCardStates((prev) => ({ ...prev, [mod.id]: 'denied' }));
      sound.playDenied();
      setTerminalLogs((prev) => [
        `> [!] CLEARANCE REJECTED: AUTHORIZATION TOKEN MISSING`,
        `> MODULE [${mod.name}] RESTRICTED TO PUBLIC PHASE [COMING SOON]`,
        ...prev.slice(0, 6),
      ]);
    }, 1150);

    setTimeout(() => {
      setCardStates((prev) => ({ ...prev, [mod.id]: 'idle' }));
    }, 4500);
  };

  return (
    <section id="command-center" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/70">
      <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-red/40 bg-cyber-red/10 text-cyber-red font-mono text-xs tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyber-red" />
            <span>ENCRYPTED COMMAND HUB</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            COMING <span className="text-cyber-red text-glow-red">SOON</span>
          </h2>
          <p className="mt-4 text-white/60 font-mono text-xs sm:text-sm tracking-widest max-w-xl">
            RESTRICTED AIR-GAPPED MODULES // SELECT ANY NODE TO ATTEMPT DECRYPTION
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-red to-cyber-cyan my-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {initialModules.map((mod) => {
            const state = cardStates[mod.id] || 'idle';

            let statusDisplay = `[ ${mod.initialStatus} ]`;
            let badgeClass = 'text-white/60 border-white/20 bg-white/5';

            if (state === 'authenticating') {
              statusDisplay = '[ AUTHENTICATING... ]';
              badgeClass = 'text-cyber-cyan border-cyber-cyan bg-cyber-cyan/20 animate-pulse';
            } else if (state === 'encrypted') {
              statusDisplay = '[ ENCRYPTED ]';
              badgeClass = 'text-yellow-400 border-yellow-400 bg-yellow-400/20';
            } else if (state === 'denied') {
              statusDisplay = '[ REVEAL DENIED ]';
              badgeClass = 'text-cyber-red border-cyber-red bg-cyber-red/20 animate-bounce';
            }

            return (
              <div
                key={mod.id}
                onClick={() => handleCardClick(mod)}
                className={`relative p-5 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[230px] select-none ${
                  state === 'denied'
                    ? 'border-cyber-red bg-cyber-red/10 shadow-[0_0_20px_rgba(255,31,67,0.3)]'
                    : state === 'authenticating'
                    ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'border-cyber-border bg-cyber-surface/60 hover:bg-cyber-surface hover:border-white/40'
                }`}
                data-cursor="access"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/40 tracking-wider">
                    {mod.code}
                  </span>
                  <Lock
                    className={`w-4 h-4 transition-colors ${
                      state === 'denied'
                        ? 'text-cyber-red'
                        : state === 'authenticating'
                        ? 'text-cyber-cyan'
                        : 'text-white/30'
                    }`}
                  />
                </div>

                <div className="my-3">
                  <h3 className="font-display font-black text-lg text-white tracking-wider uppercase mb-1">
                    {mod.name}
                  </h3>
                  <p className="font-mono text-[10px] text-white/50 line-clamp-2 leading-relaxed">
                    {mod.meta}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded tracking-widest font-bold border transition-colors ${badgeClass}`}
                    >
                      {statusDisplay}
                    </span>
                    <span className="font-mono text-[9px] text-white/30">
                      {state === 'idle' ? 'PROBE' : 'LOCK'}
                    </span>
                  </div>

                  {/* 3D Network Locate Trigger */}
                  <button
                    onClick={(e) => locateOn3DNetwork(mod.id, e)}
                    className="w-full flex items-center justify-center gap-1.5 py-1 rounded bg-white/5 hover:bg-cyber-cyan/20 border border-white/10 hover:border-cyber-cyan/50 text-[10px] font-mono text-white/60 hover:text-cyber-cyan transition-colors"
                    title="Track and glide camera to this node in the 3D Hacker World"
                  >
                    <Compass className="w-3 h-3 text-cyber-cyan" />
                    <span>LOCATE ON 3D NETWORK</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-[#06080d] font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/70">
              <Terminal className="w-4 h-4 text-cyber-cyan" />
              <span className="font-bold tracking-wider">ROOTIFY SECURITY AUDIT LOG // REAL-TIME CONSOLE</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
              <span>LOG STREAM LIVE</span>
            </div>
          </div>

          <div className="space-y-1.5 min-h-[100px] text-[11px] sm:text-xs">
            {terminalLogs.map((log, index) => (
              <div
                key={index}
                className={`transition-all ${
                  log.includes('REJECTED') || log.includes('FAIL')
                    ? 'text-cyber-red font-semibold'
                    : log.includes('PROBE')
                    ? 'text-cyber-cyan'
                    : log.includes('ENCRYPTED')
                    ? 'text-yellow-400'
                    : 'text-white/70'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-white/40">
            <span>TIP: CLICK ANY LOCKED MODULE ABOVE TO TEST THE DECRYPTION INTERFACE OR LOCATE IN 3D.</span>
            <span className="text-white/60">INTEGRITY: HIGH // ZERO FAKE DATA TOLERANCE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
