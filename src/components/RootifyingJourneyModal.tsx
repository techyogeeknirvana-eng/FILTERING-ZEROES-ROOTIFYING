import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Radio,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Zap,
  Activity,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface RootifyingJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckpointData {
  id: number;
  phaseNumber: string;
  isUnlocked: boolean;
  title: string;
  statusLabel: string;
  description?: string;
  link?: string;
}

const CHECKPOINTS: CheckpointData[] = [
  {
    id: 1,
    phaseNumber: '01',
    isUnlocked: true,
    title: 'PHASE 01: THE SIGNAL',
    statusLabel: 'NOW OPEN',
    description: 'Your journey begins here. Step into the first signal and build your edge.',
    link: 'https://unstop.com/o/812FQZe?lb=AOfe9oit&utm_medium=Share&utm_source=prabhjot2265&utm_campaign=Workshops',
  },
  {
    id: 2,
    phaseNumber: '02',
    isUnlocked: false,
    title: 'CHECKPOINT 02',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 3,
    phaseNumber: '03',
    isUnlocked: false,
    title: 'CHECKPOINT 03',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 4,
    phaseNumber: '04',
    isUnlocked: false,
    title: 'CHECKPOINT 04',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 5,
    phaseNumber: '05',
    isUnlocked: false,
    title: 'CHECKPOINT 05',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 6,
    phaseNumber: '06',
    isUnlocked: false,
    title: 'CHECKPOINT 06',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 7,
    phaseNumber: '07',
    isUnlocked: false,
    title: 'CHECKPOINT 07',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
  {
    id: 8,
    phaseNumber: '08',
    isUnlocked: false,
    title: 'CHECKPOINT 08',
    statusLabel: 'SIGNAL DETECTED — REVEALING SOON',
  },
];

export const RootifyingJourneyModal: React.FC<RootifyingJourneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [animReady, setAnimReady] = useState(false);
  const [illuminatedSteps, setIlluminatedSteps] = useState<number[]>([]);
  const [lockedAlertMessage, setLockedAlertMessage] = useState<string | null>(null);
  const [lockedAlertId, setLockedAlertId] = useState<number | null>(null);
  const [shakingId, setShakingId] = useState<number | null>(null);
  const alertTimeoutRef = useRef<number | null>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Play entrance sound
    sound.playSystemActivation();

    // Prevent background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Progressive entrance sequence
    const t0 = setTimeout(() => {
      setAnimReady(true);
    }, 100);

    // Sequentially illuminate checkpoints as the path draws
    const timers: number[] = [];
    CHECKPOINTS.forEach((_, idx) => {
      const t = setTimeout(() => {
        setIlluminatedSteps((prev) => [...prev, idx + 1]);
        if (idx === 0) {
          sound.playAccessVerified();
        } else if (idx % 2 === 0) {
          sound.playNodeDetected();
        }
      }, 300 + idx * 240);
      timers.push(t);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playHoverClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t0);
      timers.forEach(clearTimeout);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLockedClick = (id: number) => {
    sound.playBeep(260, 0.08, 0.04);
    setShakingId(id);
    setTimeout(() => setShakingId(null), 500);

    setLockedAlertId(id);
    setLockedAlertMessage('This signal has not been decoded yet. Stay tuned.');

    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = window.setTimeout(() => {
      setLockedAlertMessage(null);
      setLockedAlertId(null);
    }, 3800);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-modal-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#030408]/98 backdrop-blur-xl text-[#e2e8f0] selection:bg-cyber-red selection:text-white transition-opacity duration-300 overflow-hidden"
    >
      {/* =========================================================
          BACKGROUND ATMOSPHERE & CYBERNETIC PARTICLES
          ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient Fog Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyber-red/10 blur-[130px]" />
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] rounded-full bg-cyber-cyan/10 blur-[150px]" />
        <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-blue-600/10 blur-[140px]" />

        {/* Digital Grid & Scanlines */}
        <div className="absolute inset-0 hud-grid opacity-15" />
        <div className="absolute inset-0 scanline-bg opacity-20" />

        {/* Binary Dust Flares */}
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping opacity-60" />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping opacity-60 delay-700" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 rounded-full bg-white animate-pulse opacity-40 delay-1000" />
      </div>

      {/* =========================================================
          TOP COMMAND HUD BAR
          ========================================================= */}
      <header className="relative z-30 shrink-0 border-b border-white/10 bg-[#04060c]/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        {/* Left Branding & Protocol Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Radio className="w-4 h-4 text-cyber-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-[0.25em] text-cyber-cyan uppercase">
                ROOTIFY PROTOCOL // THE SIGNAL PATH
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-green/20 text-brand-green border border-brand-green/40 animate-pulse">
                LIVE
              </span>
            </div>
            <h1
              id="journey-modal-title"
              className="font-display font-black text-xs sm:text-sm tracking-widest text-white/90 uppercase"
            >
              FILTERING ZEROES: ROOTIFYING JOURNEY
            </h1>
          </div>
        </div>

        {/* Center Tagline (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-center">
          <span className="font-mono text-[11px] font-extrabold tracking-[0.25em] bg-gradient-to-r from-cyber-red via-white to-cyber-cyan bg-clip-text text-transparent">
            BORN IN THE 0. RESURRECTED IN THE 1.
          </span>
          <span className="font-mono text-[9px] text-white/40 tracking-wider">
            PHASE 0 ──────── 8 CHECKPOINTS ────────▶ PHASE 1
          </span>
        </div>

        {/* Right Actions: Telemetry Badge & Close Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/5 font-mono text-[11px]">
            <span className="text-white/40">DECODED:</span>
            <span className="text-cyber-cyan font-bold">1 / 8</span>
          </div>

          <button
            onClick={() => {
              sound.playHoverClick();
              onClose();
            }}
            className="group relative px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-widest uppercase border border-white/20 bg-white/5 hover:bg-cyber-red/20 hover:border-cyber-red hover:text-white transition-all duration-200 flex items-center gap-2 text-white/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-95"
            aria-label="Close Journey Interface"
          >
            <span className="hidden sm:inline text-white/50 text-[10px]">[ESC]</span>
            <span>CLOSE</span>
            <X className="w-4 h-4 text-cyber-red group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </header>

      {/* =========================================================
          GLOBAL HOLOGRAPHIC ENCRYPTION ALERT (When locked node is tapped)
          ========================================================= */}
      {lockedAlertMessage && (
        <div className="absolute top-18 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="pointer-events-auto max-w-md w-full px-5 py-3.5 rounded-xl border border-cyber-red/60 bg-black/90 shadow-[0_0_35px_rgba(255,31,67,0.45)] backdrop-blur-md flex items-center gap-3.5 text-left">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-cyber-red/20 border border-cyber-red flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-cyber-red animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[10px] font-black uppercase tracking-widest text-cyber-red">
                CHECKPOINT {String(lockedAlertId).padStart(2, '0')} // SIGNAL CIPHER ACTIVE
              </div>
              <div className="font-mono text-xs sm:text-sm text-white font-semibold">
                "{lockedAlertMessage}"
              </div>
            </div>
            <button
              onClick={() => {
                setLockedAlertMessage(null);
                setLockedAlertId(null);
              }}
              className="text-white/40 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN SCROLLABLE JOURNEY CANVAS
          ========================================================= */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 lg:p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-16">
          {/* Section Sub-Header / Mission Overview */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 font-mono text-[10px] sm:text-xs text-cyber-cyan tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>TRANSMISSION TRAJECTORY: ZERO TO ROOT</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white">
              THE <span className="text-cyber-cyan text-glow-cyan">SIGNAL</span>{' '}
              <span className="text-white">PATH</span>
            </h2>
            <p className="mt-2 font-mono text-xs sm:text-sm text-white/60 max-w-2xl mx-auto tracking-wide">
              An 8-checkpoint mission route traversing from Phase 0 into Phase 1 sovereign territory.
              Decode each signal as it surfaces.
            </p>
          </div>

          {/* =====================================================
              DESKTOP VIEW: CINEMATIC WINDING SERPENTINE SNAKE PATH
              (Visible on lg screens >= 1024px)
              ===================================================== */}
          <div className="hidden lg:block relative my-8">
            {/* SVG Connecting Neon Rope / Wire with Glowing Filters */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minHeight: '620px' }}
              viewBox="0 0 1150 620"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Neon Glow Filters */}
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="35%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#ff1f43" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
              </defs>

              {/* Background ambient rail track */}
              <path
                d="M 140 140 L 980 140 C 1080 140 1080 470 980 470 L 140 470"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Outer Neon Halo */}
              <path
                d="M 140 140 L 980 140 C 1080 140 1080 470 980 470 L 140 470"
                stroke="url(#pathGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neon-glow)"
                opacity={animReady ? '0.75' : '0'}
                className="transition-opacity duration-1000"
              />

              {/* Core Active Laser Fiber (Draws progressively) */}
              <path
                d="M 140 140 L 980 140 C 1080 140 1080 470 980 470 L 140 470"
                stroke="url(#pathGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2600"
                strokeDashoffset={animReady ? '0' : '2600'}
                style={{
                  transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />

              {/* High-speed animated data pulses travelling down the wire */}
              {animReady && (
                <path
                  d="M 140 140 L 980 140 C 1080 140 1080 470 980 470 L 140 470"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="18 240"
                  style={{
                    animation: 'signal-pulse-flow 3.5s linear infinite',
                  }}
                />
              )}
            </svg>

            {/* Checkpoints Grid: 2 Winding Rows */}
            <div className="relative z-10 space-y-24 py-4">
              {/* Row 1: Left to Right (CP 01 -> CP 02 -> CP 03 -> CP 04) */}
              <div className="grid grid-cols-4 gap-6 items-start">
                {CHECKPOINTS.slice(0, 4).map((cp) => (
                  <CheckpointCard
                    key={cp.id}
                    checkpoint={cp}
                    isIlluminated={illuminatedSteps.includes(cp.id)}
                    isShaking={shakingId === cp.id}
                    onLockedClick={() => handleLockedClick(cp.id)}
                  />
                ))}
              </div>

              {/* Row 2: Right to Left (CP 05 -> CP 06 -> CP 07 -> CP 08) */}
              <div className="grid grid-cols-4 gap-6 items-start">
                {/* Visual order: CP 08 (left) <- CP 07 <- CP 06 <- CP 05 (right, near the curve) */}
                {[CHECKPOINTS[7], CHECKPOINTS[6], CHECKPOINTS[5], CHECKPOINTS[4]].map((cp) => (
                  <CheckpointCard
                    key={cp.id}
                    checkpoint={cp}
                    isIlluminated={illuminatedSteps.includes(cp.id)}
                    isShaking={shakingId === cp.id}
                    onLockedClick={() => handleLockedClick(cp.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* =====================================================
              MOBILE / TABLET VIEW: VERTICAL ANIMATED HIGHWAY
              (Visible on screens < 1024px)
              ===================================================== */}
          <div className="block lg:hidden relative my-6">
            {/* Vertical Animated Glowing Line */}
            <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-1 bg-white/10 rounded-full">
              <div
                className="w-full bg-gradient-to-b from-cyber-cyan via-white to-cyber-red rounded-full shadow-[0_0_15px_#00f0ff] transition-all duration-1000"
                style={{
                  height: `${Math.min(100, (illuminatedSteps.length / 8) * 100)}%`,
                }}
              />
            </div>

            {/* Vertical Checkpoints Stack */}
            <div className="space-y-6 pl-14 sm:pl-20">
              {CHECKPOINTS.map((cp) => (
                <CheckpointCard
                  key={cp.id}
                  checkpoint={cp}
                  isIlluminated={illuminatedSteps.includes(cp.id)}
                  isShaking={shakingId === cp.id}
                  onLockedClick={() => handleLockedClick(cp.id)}
                  isMobile
                />
              ))}
            </div>
          </div>

          {/* =====================================================
              BOTTOM TELEMETRY FOOTER & BRANDING
              ===================================================== */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span>PHASE ZERO CLEARANCE // SOVEREIGN MISSION PROTOCOL</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-white/70 font-bold">BORN IN THE 0. RESURRECTED IN THE 1.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded Custom Keyframe Animations */}
      <style>{`
        @keyframes signal-pulse-flow {
          0% {
            stroke-dashoffset: 800;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes card-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-card-shake {
          animation: card-shake 0.45s ease-in-out;
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
   INDIVIDUAL CHECKPOINT CARD COMPONENT
   ========================================================================= */
interface CheckpointCardProps {
  checkpoint: CheckpointData;
  isIlluminated: boolean;
  isShaking: boolean;
  onLockedClick: () => void;
  isMobile?: boolean;
}

const CheckpointCard: React.FC<CheckpointCardProps> = ({
  checkpoint,
  isIlluminated,
  isShaking,
  onLockedClick,
  isMobile = false,
}) => {
  const { isUnlocked, title, statusLabel, description, link } = checkpoint;

  // -----------------------------------------------------------
  // CHECKPOINT 01: UNLOCKED FIRST SIGNAL WORKSHOP CARD
  // -----------------------------------------------------------
  if (isUnlocked) {
    return (
      <div
        className={`relative flex flex-col rounded-xl p-5 sm:p-6 bg-[#060a14] border-2 border-cyber-cyan shadow-[0_0_35px_rgba(0,240,255,0.35)] transition-all duration-300 ${
          isIlluminated ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
        } ${isShaking ? 'animate-card-shake' : ''}`}
      >
        {/* Node marker pin on desktop */}
        {!isMobile && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <span className="relative flex h-7 w-7">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-7 w-7 bg-black border-2 border-cyber-cyan items-center justify-center text-[10px] font-mono font-black text-cyber-cyan">
                01
              </span>
            </span>
          </div>
        )}

        {/* Mobile Connector Pin */}
        {isMobile && (
          <div className="absolute -left-12 sm:-left-16 top-6 flex items-center justify-center">
            <span className="relative flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-8 w-8 bg-black border-2 border-cyber-cyan items-center justify-center text-xs font-mono font-black text-cyber-cyan">
                01
              </span>
            </span>
          </div>
        )}

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyber-red via-white to-cyber-cyan rounded-t-xl" />

        {/* Header Telemetry */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyber-cyan/30 mt-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyber-cyan font-bold tracking-widest uppercase">
            <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>UNLOCKED NODE</span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase bg-brand-green/20 text-brand-green border border-brand-green/40 shadow-[0_0_10px_rgba(0,255,136,0.3)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
            {statusLabel}
          </span>
        </div>

        {/* Checkpoint Title & Micro-story */}
        <div className="mb-4">
          <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-wide uppercase text-glow-cyan">
            {title}
          </h3>
          <p className="mt-2 font-mono text-xs text-white/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Workshop Telemetry Details */}
        <div className="p-3 rounded-lg bg-black/60 border border-cyber-cyan/30 mb-5 font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-white/50">
            <span>TRACK:</span>
            <span className="text-white font-bold">WORKSHOP 01</span>
          </div>
          <div className="flex items-center justify-between text-white/50">
            <span>ENTRY FEE:</span>
            <span className="text-cyber-cyan font-black">100% FREE</span>
          </div>
          <div className="flex items-center justify-between text-white/50">
            <span>CLEARANCE:</span>
            <span className="text-brand-green font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-green" />
              VERIFIED OPEN
            </span>
          </div>
        </div>

        {/* Prominent REGISTER FREE Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.playAccessGranted()}
          className="cyber-button group relative w-full py-3.5 px-4 rounded-lg font-mono font-black text-xs sm:text-sm tracking-[0.2em] uppercase bg-gradient-to-r from-cyber-red via-white to-cyber-cyan text-black hover:text-black font-extrabold shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_40px_rgba(255,31,67,0.8)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          data-cursor="access"
        >
          <span>REGISTER FREE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </a>

        {/* Sub-label for gateway */}
        <div className="mt-2 text-center font-mono text-[9px] text-white/40 flex items-center justify-center gap-1">
          <span>HOSTED ON UNSTOP</span>
          <ExternalLink className="w-2.5 h-2.5 text-white/40" />
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // CHECKPOINTS 02 TO 08: LOCKED / REVEALING SOON
  // -----------------------------------------------------------
  return (
    <div
      onClick={onLockedClick}
      className={`relative flex flex-col justify-between rounded-xl p-5 sm:p-6 bg-[#04060c]/90 border border-white/10 hover:border-cyber-cyan/40 hover:bg-[#070b16] transition-all duration-300 cursor-pointer select-none group ${
        isIlluminated ? 'opacity-85' : 'opacity-40'
      } ${isShaking ? 'animate-card-shake border-cyber-red shadow-[0_0_20px_rgba(255,31,67,0.4)]' : ''}`}
      title="Click to probe checkpoint transmission"
    >
      {/* Node marker pin on desktop */}
      {!isMobile && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-black border border-white/20 group-hover:border-cyber-cyan/50 flex items-center justify-center text-[10px] font-mono text-white/40 group-hover:text-cyber-cyan transition-colors">
            {checkpoint.phaseNumber}
          </div>
        </div>
      )}

      {/* Mobile Connector Pin */}
      {isMobile && (
        <div className="absolute -left-12 sm:-left-16 top-6 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-black border border-white/20 group-hover:border-cyber-cyan/50 flex items-center justify-center text-xs font-mono text-white/40 group-hover:text-cyber-cyan transition-colors">
            {checkpoint.phaseNumber}
          </div>
        </div>
      )}

      <div>
        {/* Header Telemetry */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 group-hover:text-white/60 tracking-widest uppercase">
            <Lock className="w-3 h-3 text-white/40 group-hover:text-cyber-cyan transition-colors" />
            <span>LOCKED NODE</span>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-white/40 group-hover:text-white/60">
            [ ENCRYPTED ]
          </span>
        </div>

        {/* Title: Only Checkpoint number */}
        <div className="mb-4">
          <h3 className="font-display font-black text-base sm:text-lg text-white/70 group-hover:text-white tracking-wider uppercase transition-colors">
            {title}
          </h3>
          {/* Exact required label */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-red/10 border border-cyber-red/30 text-cyber-red font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Mystery Encrypted Cipher Panel */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-white/40 space-y-1 mb-4 group-hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <span>CIPHER FREQUENCY:</span>
            <span className="text-white/30">████.██ MHz</span>
          </div>
          <div className="flex items-center justify-between">
            <span>DECRYPTION STATUS:</span>
            <span className="text-amber-500/80">IN QUEUE</span>
          </div>
        </div>
      </div>

      {/* Inaccessible Trigger Indicator */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-white/40 group-hover:text-cyber-cyan transition-colors">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>PROBE SIGNAL</span>
        </span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
