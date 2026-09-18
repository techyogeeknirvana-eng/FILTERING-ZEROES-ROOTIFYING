import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Radio,
  ExternalLink,
  Terminal,
  Cpu,
  Cloud,
  Network,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NodeSlot {
  id: number;
  label: string;
  code: string;
  isVerified: boolean;
  name?: string;
  subLabel?: string;
  image?: string;
  coords: string;
  status: string;
}

export const CommunityPartnerSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Status rotation for unknown nodes
  const [unknownStatuses, setUnknownStatuses] = useState<string[]>([
    '[ CLASSIFIED ]',
    '[ REVEALING SOON ]',
    '[ SIGNAL DETECTED ]',
    '[ ACCESS PENDING ]',
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasEntered) {
          setHasEntered(true);
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasEntered]);

  // Scan sequence animation
  useEffect(() => {
    if (!hasEntered) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTimeout(() => {
        setScanStep(5);
      }, 0);
      return;
    }

    // Step 1: > SCANNING NETWORK...
    const t1 = setTimeout(() => {
      setScanStep(1);
      sound.playBeep(900, 0.04, 0.03);
    }, 100);

    // Step 2: > 05 NODES DETECTED
    const t2 = setTimeout(() => {
      setScanStep(2);
      sound.playBeep(1200, 0.04, 0.04);
    }, 450);

    // Step 3: Outlines appear & scanning beam
    const t3 = setTimeout(() => {
      setScanStep(3);
      sound.playClassifiedBeep();
    }, 850);

    // Step 4: Node 01 activates with glitch & pulse to other nodes
    const t4 = setTimeout(() => {
      setScanStep(4);
      sound.playSystemActivation();
    }, 1300);

    // Step 5: Network settled
    const t5 = setTimeout(() => {
      setScanStep(5);
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [hasEntered]);

  // Periodic mystery status flicker
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = ['[ CLASSIFIED ]', '[ REVEALING SOON ]', '[ SIGNAL DETECTED ]', '[ ACCESS PENDING ]'];
      setUnknownStatuses([
        pool[Math.floor(Math.random() * pool.length)],
        pool[Math.floor(Math.random() * pool.length)],
        pool[Math.floor(Math.random() * pool.length)],
        pool[Math.floor(Math.random() * pool.length)],
      ]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const nodes: NodeSlot[] = [
    {
      id: 1,
      label: 'NODE 01',
      code: 'VERIFIED CONNECTION',
      isVerified: true,
      name: 'ACE CLUB',
      subLabel: 'ARTICULATION • CONFIDENCE • EXPRESSION',
      image: '/assets/collaborators/ace_club.jpg',
      coords: 'LAT: 0x1A // LON: 0xFF',
      status: hoveredNode === 1 ? '[ CONNECTION ACTIVE ]' : 'CONNECTION VERIFIED',
    },
    {
      id: 2,
      label: 'NODE 02',
      code: 'NETWORK ENCRYPTED',
      isVerified: false,
      coords: 'LAT: 0x2B // LON: 0x0A',
      status: hoveredNode === 2 ? '[ IDENTITY CLASSIFIED ]' : unknownStatuses[0],
    },
    {
      id: 3,
      label: 'NODE 03',
      code: 'NETWORK ENCRYPTED',
      isVerified: false,
      coords: 'LAT: 0x3C // LON: 0x1B',
      status: hoveredNode === 3 ? '[ IDENTITY CLASSIFIED ]' : unknownStatuses[1],
    },
    {
      id: 4,
      label: 'NODE 04',
      code: 'NETWORK ENCRYPTED',
      isVerified: false,
      coords: 'LAT: 0x4D // LON: 0x2C',
      status: hoveredNode === 4 ? '[ IDENTITY CLASSIFIED ]' : unknownStatuses[2],
    },
    {
      id: 5,
      label: 'NODE 05',
      code: 'NETWORK ENCRYPTED',
      isVerified: false,
      coords: 'LAT: 0x5E // LON: 0x3D',
      status: hoveredNode === 5 ? '[ IDENTITY CLASSIFIED ]' : unknownStatuses[3],
    },
  ];

  const handleNodeEnter = (node: NodeSlot) => {
    setHoveredNode(node.id);
    if (node.isVerified) {
      sound.playButtonConfirm();
      setActiveMessage('> CONNECTION ACTIVE // NODE://ACE_CLUB');
    } else {
      sound.playHoverClick();
      setActiveMessage('> IDENTITY CLASSIFIED // ENCRYPTION: ACTIVE');
    }
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
    setActiveMessage(null);
  };

  return (
    <section
      ref={sectionRef}
      id="partner"
      className="relative py-28 px-4 sm:px-6 bg-[#040507] text-[#e2e8f0] overflow-hidden border-t border-cyber-border/70"
    >
      {/* Anchor aliases for #collaborators and #network */}
      <div id="collaborators" className="absolute -top-24 pointer-events-none" />
      <div id="network" className="absolute -top-24 pointer-events-none" />

      {/* Localized background ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20" />
        <div className="absolute inset-0 scanline-bg opacity-25" />

        {/* Subtle atmospheric lighting */}
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-cyber-cyan/10 blur-[140px]" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 rounded-full bg-cyber-red/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyber-blue/5 blur-[160px]" />

        {/* Cinematic Terminal Details */}
        <div className="hidden xl:block absolute top-12 left-8 font-mono text-[9px] text-white/20 tracking-widest leading-relaxed">
          <div>NETWORK://ROOTIFYING</div>
          <div>STATUS://ACTIVE</div>
          <div>NODES://05</div>
        </div>
        <div className="hidden xl:block absolute top-12 right-8 font-mono text-[9px] text-right text-white/20 tracking-widest leading-relaxed">
          <div>VERIFIED://01</div>
          <div>PENDING://04</div>
          <div>SIGNAL://CONNECTED</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Network Scan Sequence Terminal Indicator */}
        {scanStep > 0 && scanStep < 5 && (
          <div className="mb-6 max-w-md mx-auto p-3 rounded border border-cyber-cyan/30 bg-[#06080d]/90 font-mono text-xs text-center text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyber-cyan" />
              <span>
                {scanStep === 1 && '> SCANNING NETWORK...'}
                {scanStep === 2 && '> 05 NODES DETECTED // INITIALIZING MAP...'}
                {scanStep === 3 && '> LOCATING AUTHENTICATED HUBS...'}
                {scanStep === 4 && '> NODE 01 VERIFIED // DATA PULSE TRANSMITTED'}
              </span>
            </div>
          </div>
        )}

        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          {/* Terminal Command Style Heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-border bg-black/60 font-mono text-xs text-cyber-cyan tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-cyber-red" />
            <span className="text-white/60">root@rootifying:~$</span>
            <span className="text-cyber-cyan font-bold">./scan_network.sh</span>
          </div>

          <div className="font-mono text-[10px] sm:text-xs text-cyber-red font-bold tracking-[0.25em] uppercase mb-2">
            // STRATEGIC COLLABORATORS
          </div>

          {/* Large Master Heading: THE NETWORK */}
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-red text-glow-cyan">NETWORK</span>
          </h2>

          <p className="mt-4 font-mono text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed tracking-wider">
            Communities. Institutions. Industry.
            <br />
            <span className="text-cyber-cyan font-bold">One signal. Infinite possibilities.</span>
          </p>

          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-cyber-red my-6" />
        </div>

        {/* ===================================================
            CINEMATIC 5-NODE NETWORK COMPOSITION
            =================================================== */}
        <div className="relative mb-16">
          {/* SVG Digital Network Circuit Connection Lines (Visible on Desktop) */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 650"
            fill="none"
          >
            {/* Top Node (500, 110) to Left Node (250, 310) */}
            <path
              d="M 500 150 L 250 310"
              stroke={scanStep >= 4 ? '#00f0ff' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1.5"
              strokeDasharray={scanStep >= 4 ? '4 4' : '2 4'}
              className={scanStep === 4 ? 'animate-pulse' : ''}
            />
            {/* Top Node (500, 110) to Right Node (750, 310) */}
            <path
              d="M 500 150 L 750 310"
              stroke={scanStep >= 4 ? '#00f0ff' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1.5"
              strokeDasharray={scanStep >= 4 ? '4 4' : '2 4'}
              className={scanStep === 4 ? 'animate-pulse' : ''}
            />
            {/* Left Node (250, 310) to Bottom Left (360, 520) */}
            <path
              d="M 250 370 L 360 520"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              strokeDasharray="2 4"
            />
            {/* Right Node (750, 310) to Bottom Right (640, 520) */}
            <path
              d="M 750 370 L 640 520"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              strokeDasharray="2 4"
            />
            {/* Bottom Left (360, 520) to Bottom Right (640, 520) */}
            <path
              d="M 360 520 L 640 520"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </svg>

          {/* 5-Node Constellation Grid */}
          <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10">
            {/* ROW 1: NODE 01 (CONFIRMED COLLABORATOR) */}
            <div className="w-full max-w-sm">
              <div
                onMouseEnter={() => handleNodeEnter(nodes[0])}
                onMouseLeave={handleNodeLeave}
                className={`relative rounded-2xl p-6 sm:p-7 bg-[#06080e]/95 border transition-all duration-300 select-none flex flex-col justify-between ${
                  hoveredNode === 1
                    ? 'border-cyber-cyan shadow-[0_0_40px_rgba(0,240,255,0.35)] -translate-y-1.5'
                    : 'border-cyber-cyan/50 shadow-[0_0_25px_rgba(0,240,255,0.18)]'
                }`}
                data-cursor="access"
              >
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan rounded-tl-xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-red rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan rounded-bl-xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-red rounded-br-xl pointer-events-none" />

                {/* Scanline overlay */}
                <div className="absolute inset-0 scanline-bg opacity-20 rounded-2xl pointer-events-none" />

                {/* Card Header Telemetry */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyber-cyan/25 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
                    <span className="text-cyber-cyan font-bold tracking-widest">
                      01 // VERIFIED CONNECTION
                    </span>
                  </div>
                  <span className="text-white/40 tracking-wider font-mono">
                    {nodes[0].coords}
                  </span>
                </div>

                {/* Collaborator Logo Container - Aspect Ratio Preserved Strictly */}
                <div className="my-2 flex flex-col items-center text-center">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-cyber-cyan/40 bg-[#020408] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:border-cyber-cyan transition-all">
                    <img
                      src={nodes[0].image}
                      alt="ACE Club - Strategic Collaborator"
                      className="w-full h-full object-contain filter contrast-105 brightness-100 transition-transform duration-300 hover:scale-105"
                    />
                    {/* Subtle Holographic Scan Sweep on Hover */}
                    {hoveredNode === 1 && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_15px_#00f0ff] animate-[scanline-vertical_1.2s_linear_infinite]" />
                    )}
                  </div>

                  <h3 className="mt-4 font-display font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
                    {nodes[0].name}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-[11px] text-white/70 tracking-widest uppercase mt-1">
                    {nodes[0].subLabel}
                  </p>
                </div>

                {/* Card Footer Status */}
                <div className="pt-3.5 mt-4 border-t border-cyber-cyan/20 flex items-center justify-between font-mono text-[10px]">
                  <div className="inline-flex items-center gap-1.5 text-brand-green font-bold tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{nodes[0].status}</span>
                  </div>
                  <span className="text-cyber-cyan/60 tracking-wider">
                    NETWORK NODE // ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2 & ROW 3: THE 4 MYSTERIOUS UNKNOWN NODES */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {nodes.slice(1).map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => handleNodeEnter(node)}
                    onMouseLeave={handleNodeLeave}
                    className={`relative rounded-2xl p-6 bg-[#06080e]/85 border transition-all duration-300 select-none flex flex-col justify-between min-h-[280px] ${
                      isHovered
                        ? 'border-cyber-red shadow-[0_0_30px_rgba(255,31,67,0.3)] bg-[#090b14] -translate-y-1'
                        : 'border-white/10 shadow-lg'
                    }`}
                    data-cursor="access"
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 rounded-br-xl pointer-events-none" />

                    {/* Scanline */}
                    <div className="absolute inset-0 scanline-bg opacity-15 rounded-2xl pointer-events-none" />

                    {/* Top Telemetry */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5 font-mono text-[9px] text-white/40">
                      <span>0{node.id} // CLASSIFIED</span>
                      <span>{node.coords}</span>
                    </div>

                    {/* Mystery Symbol: ? COMING SOON */}
                    <div className="my-auto flex flex-col items-center justify-center text-center py-4">
                      <div className="relative w-20 h-20 rounded-full border border-white/15 bg-black/60 flex items-center justify-center mb-3">
                        <span
                          className={`font-display font-black text-3xl sm:text-4xl text-white/40 transition-all duration-300 ${
                            isHovered
                              ? 'text-cyber-red scale-110 animate-pulse'
                              : 'hover:rotate-6'
                          }`}
                        >
                          {isHovered ? 'ACCESS?' : '?'}
                        </span>
                        <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25" />
                      </div>

                      <div className="font-display font-black text-sm tracking-widest text-white/80 uppercase">
                        COMING SOON
                      </div>
                      <div className="font-mono text-[9px] text-white/40 tracking-widest mt-1">
                        {isHovered ? 'IDENTITY ENCRYPTED' : 'REVEAL PENDING'}
                      </div>
                    </div>

                    {/* Bottom Status */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                      <span
                        className={`font-bold tracking-wider ${
                          isHovered ? 'text-cyber-red animate-pulse' : 'text-white/40'
                        }`}
                      >
                        {node.status}
                      </span>
                      <span className="text-[9px] text-white/20">
                        ENC://256
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Terminal Telemetry Output (Visible when hovering) */}
        {activeMessage && (
          <div className="mb-10 max-w-md mx-auto p-2.5 rounded bg-black/80 border border-cyber-cyan/40 font-mono text-[11px] text-cyber-cyan text-center shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-in fade-in duration-150">
            {activeMessage}
          </div>
        )}

        {/* ===================================================
            BOTTOM MESSAGE
            =================================================== */}
        <div className="text-center py-10 px-4 rounded-xl border border-white/10 bg-[#06080d]/80 font-mono">
          <div className="inline-block px-3 py-1 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan text-xs font-black tracking-[0.25em] uppercase mb-4">
            NETWORK DIRECTIVE
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-widest uppercase mb-2">
            THE NETWORK IS GROWING.
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono my-3">
            <span className="text-cyber-cyan font-bold">01 CONNECTION VERIFIED</span>
            <span className="text-white/20">|</span>
            <span className="text-cyber-red font-bold">04 SIGNALS PENDING</span>
          </div>

          <div className="font-mono text-xs sm:text-sm text-white/70 tracking-widest uppercase mt-4 flex items-center justify-center gap-1.5">
            <span>MORE WILL BE REVEALED.</span>
            <span className="inline-block w-2 h-4 bg-cyber-cyan animate-pulse" />
          </div>

          <div className="w-16 h-[1px] bg-white/15 mx-auto my-6" />

          {/* Become a Community Partner CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <a
              href="https://docs.google.com/forms/d/1lDHES3lIdxrCKSNH2Ue-k2s26zMMcTSl4P0aloMZp80/edit"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playButtonConfirm()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-bold text-xs tracking-widest uppercase bg-cyber-red/15 hover:bg-cyber-red text-cyber-red hover:text-white border border-cyber-red/50 transition-all duration-200 shadow-[0_0_20px_rgba(255,31,67,0.2)]"
              data-cursor="enter"
            >
              <span>APPLY AS STRATEGIC COLLABORATOR</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="mt-2 text-[10px] text-white/40 font-mono">
            [ JOIN THE NETWORK // CO-BRANDED RECOGNITION & TOURNAMENT QUALIFIERS ]
          </div>
        </div>

        {/* Distributed Technical Accents (AI / Cyber / Cloud / Entrepreneurship) */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-white/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyber-cyan" />
              <span>AI NEURAL NODES</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-cyber-blue" />
              <span>CLOUD INFRASTRUCTURE TOPOLOGY</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Network className="w-3 h-3 text-brand-green" />
              <span>CRYPTOGRAPHIC NETWORK VERIFIED</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/50">
            <span>NETWORK HIERARCHY:</span>
            <span className="text-white font-bold">ROOTIFY SOVEREIGNTY // 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
