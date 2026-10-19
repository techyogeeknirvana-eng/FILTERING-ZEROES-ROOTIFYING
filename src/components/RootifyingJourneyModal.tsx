import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  ExternalLink,
  Zap,
  Activity,
  ChevronRight,
  CheckCircle2,
  Volume2,
  VolumeX,
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
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 3,
    phaseNumber: '03',
    isUnlocked: false,
    title: 'CHECKPOINT 03',
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 4,
    phaseNumber: '04',
    isUnlocked: false,
    title: 'CHECKPOINT 04',
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 5,
    phaseNumber: '05',
    isUnlocked: false,
    title: 'CHECKPOINT 05',
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 6,
    phaseNumber: '06',
    isUnlocked: false,
    title: 'CHECKPOINT 06',
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 7,
    phaseNumber: '07',
    isUnlocked: false,
    title: 'CHECKPOINT 07',
    statusLabel: 'REVEALING SOON',
  },
  {
    id: 8,
    phaseNumber: '08',
    isUnlocked: false,
    title: 'CHECKPOINT 08',
    statusLabel: 'REVEALING SOON',
  },
];

type DragonMood = 'emerging' | 'idle' | 'celebrating' | 'roaring';

export const RootifyingJourneyModal: React.FC<RootifyingJourneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [animReady, setAnimReady] = useState(false);
  const [dragonMood, setDragonMood] = useState<DragonMood>('emerging');
  const [dragonDialogue, setDragonDialogue] = useState<string>(
    'I AM THE CYBER-DRAKE GUARDIAN. SEEK THE UNSEALED SIGNAL.'
  );
  const [illuminatedSteps, setIlluminatedSteps] = useState<number[]>([]);
  const [activePulseTargetId, setActivePulseTargetId] = useState<number | null>(null);
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => sound.getIsMuted());
  const moodTimeoutRef = useRef<number | null>(null);

  // Setup on modal opening
  useEffect(() => {
    if (!isOpen) return;

    sound.playSystemActivation();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Dragon emerges from digital mist
    const t0 = setTimeout(() => {
      setAnimReady(true);
      setDragonMood('idle');
      setDragonDialogue('THE ROOTIFYING PATH AWAITS. ONLY ONE FREQUENCY IS DECODED.');
    }, 1100);

    // Sequential illumination along the winding trail
    const timers: number[] = [];
    CHECKPOINTS.forEach((_, idx) => {
      const t = setTimeout(() => {
        setIlluminatedSteps((prev) => [...prev, idx + 1]);
        if (idx === 0) {
          sound.playAccessVerified();
        }
      }, 350 + idx * 220);
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
      if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Interaction when Open Checkpoint 01 is clicked
  const handleOpenCheckpointClick = () => {
    sound.playDragonWelcome();
    setDragonMood('celebrating');
    setDragonDialogue('THE FIRST SIGNAL IS OPEN. YOUR JOURNEY BEGINS NOW.');

    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    moodTimeoutRef.current = window.setTimeout(() => {
      setDragonMood('idle');
      setDragonDialogue('PROCEED TO UNSTOP REGISTRATION TO CLAIM YOUR PASS.');
    }, 4500);
  };

  // Interaction when Locked Checkpoints 02–08 are clicked
  const handleLockedCheckpointClick = (id: number) => {
    sound.playDragonRoar();
    setDragonMood('roaring');
    setActivePulseTargetId(id);
    setShakingId(id);
    setDragonDialogue('THIS SIGNAL REMAINS SEALED. ITS TIME WILL COME.');

    setTimeout(() => setShakingId(null), 600);

    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    moodTimeoutRef.current = window.setTimeout(() => {
      setDragonMood('idle');
      setActivePulseTargetId(null);
      setDragonDialogue('THE ROOTIFYING PATH AWAITS. ONLY ONE FREQUENCY IS DECODED.');
    }, 3800);
  };

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsAudioMuted(next);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-modal-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#020307]/98 backdrop-blur-2xl text-[#e2e8f0] selection:bg-cyber-red selection:text-white transition-opacity duration-300 overflow-hidden"
    >
      {/* =========================================================
          PROMINENT FIXED TOP-RIGHT CLOSE BUTTON (ALWAYS VISIBLE)
          ========================================================= */}
      <button
        onClick={() => {
          sound.playHoverClick();
          onClose();
        }}
        className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[60] w-12 h-12 rounded-xl bg-black/85 hover:bg-cyber-red/25 border-2 border-white/20 hover:border-cyber-red text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(255,31,67,0.7)] backdrop-blur-md transition-all duration-200 group active:scale-90"
        aria-label="Close Journey and return to website"
        title="Close Journey [ESC]"
      >
        <X className="w-6 h-6 text-cyber-red group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Floating Sound Toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-3 right-18 sm:top-5 sm:right-22 z-[60] h-12 px-3 rounded-xl bg-black/85 hover:bg-cyber-cyan/20 border-2 border-white/20 hover:border-cyber-cyan text-white/80 hover:text-white flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-200 text-xs font-mono"
        title="Toggle Sound Design"
      >
        {isAudioMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-cyber-red" />
            <span className="hidden md:inline text-[10px] uppercase font-bold text-cyber-red">MUTED</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="hidden md:inline text-[10px] uppercase font-bold text-cyber-cyan">AUDIO ON</span>
          </>
        )}
      </button>

      {/* =========================================================
          BACKGROUND ATMOSPHERE & CYBERNETIC MIST
          ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Guardian Color Halo */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[26rem] rounded-full blur-[140px] transition-colors duration-700 ${
            dragonMood === 'roaring'
              ? 'bg-cyber-red/25'
              : dragonMood === 'celebrating'
              ? 'bg-amber-400/20'
              : 'bg-cyber-cyan/15'
          }`}
        />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[26rem] h-[26rem] rounded-full bg-cyber-red/10 blur-[140px]" />

        {/* Digital Grid & Scanlines */}
        <div className="absolute inset-0 hud-grid opacity-15" />
        <div className="absolute inset-0 scanline-bg opacity-20" />

        {/* Ambient Mountain Silhouettes in Background */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full opacity-20 text-white"
          viewBox="0 0 1440 320"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,320 L0,220 L180,140 L340,240 L520,80 L720,200 L940,60 L1180,210 L1360,110 L1440,160 L1440,320 Z" fill="#040714" />
          <path d="M0,320 L0,260 L240,190 L460,260 L680,170 L890,260 L1120,180 L1340,270 L1440,240 L1440,320 Z" fill="#060c20" />
        </svg>
      </div>

      {/* =========================================================
          TOP COMMAND TELEMETRY BAR
          ========================================================= */}
      <header className="relative z-30 shrink-0 border-b border-white/10 bg-[#04060c]/90 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.7)] pr-32 sm:pr-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/15 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Zap className="w-4 h-4 text-cyber-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-black tracking-[0.25em] text-cyber-cyan uppercase">
                ROOTIFY PROTOCOL // CYBER-DRAKE ROUTE
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-brand-green/20 text-brand-green border border-brand-green/40">
                LIVE GUARDIAN
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

        <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] text-white/50">
          <span className="text-white/40">STATUS:</span>
          <span className="text-brand-green font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
            PHASE 01 UNSEALED
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">SEALED SIGNALS:</span>
          <span className="text-cyber-red font-bold">07 ENCRYPTED</span>
        </div>
      </header>

      {/* =========================================================
          MAIN SCROLLABLE CANVAS
          ========================================================= */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto pb-12">
          {/* =====================================================
              THE CYBER-DRAGON GUARDIAN HERO STAGE
              ===================================================== */}
          <section className="relative mb-6 text-center">
            {/* Dragon Avatar SVG & Animations */}
            <div className="relative inline-block mx-auto">
              <CyberDragonVisual
                mood={dragonMood}
                animReady={animReady}
              />

              {/* Dragon Mood Particle Ring */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                  dragonMood === 'roaring'
                    ? 'bg-cyber-red/40 scale-125'
                    : dragonMood === 'celebrating'
                    ? 'bg-amber-400/35 scale-125'
                    : 'bg-cyber-cyan/20 scale-100'
                }`}
              />
            </div>

            {/* Dragon Dialogue Speech Banner */}
            <div className="mt-2 max-w-2xl mx-auto px-4">
              <div
                className={`relative px-5 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 ${
                  dragonMood === 'roaring'
                    ? 'border-cyber-red bg-[#16060a]/95 text-cyber-red shadow-[0_0_35px_rgba(255,31,67,0.5)] animate-card-shake'
                    : dragonMood === 'celebrating'
                    ? 'border-amber-400 bg-[#161204]/95 text-amber-300 shadow-[0_0_35px_rgba(250,204,21,0.5)]'
                    : 'border-cyber-cyan/40 bg-[#060b18]/90 text-white/90 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                }`}
              >
                {/* Speech Bubble Arrow */}
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l ${
                    dragonMood === 'roaring'
                      ? 'border-cyber-red bg-[#16060a]'
                      : dragonMood === 'celebrating'
                      ? 'border-amber-400 bg-[#161204]'
                      : 'border-cyber-cyan/40 bg-[#060b18]'
                  }`}
                />

                <div className="text-center font-mono">
                  <div
                    className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-0.5 ${
                      dragonMood === 'roaring'
                        ? 'text-cyber-red'
                        : dragonMood === 'celebrating'
                        ? 'text-amber-400'
                        : 'text-cyber-cyan'
                    }`}
                  >
                    {dragonMood === 'roaring' && '⚠ GUARDIAN ROAR // ACCESS SEALED'}
                    {dragonMood === 'celebrating' && '✦ GUARDIAN APPROVAL // SIGNAL VERIFIED'}
                    {dragonMood === 'emerging' && '⚡ PROTOCOL SYNCHRONIZATION'}
                    {dragonMood === 'idle' && '◆ GUARDIAN TELEMETRY // ACTIVE SENTINEL'}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-bold tracking-wide">
                    "{dragonDialogue}"
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              PRIMARY HIGHLIGHT: CHECKPOINT 01 — THE SIGNAL
              (Front & Center, Fully Visible on Laptops & Mobile)
              ===================================================== */}
          <div className="mb-10 max-w-2xl mx-auto px-2">
            <div className="text-center mb-3">
              <span className="font-mono text-[10px] tracking-widest text-cyber-cyan uppercase font-bold">
                [ CURRENT ACTIVE MISSION GATEWAY ]
              </span>
            </div>

            <div
              onClick={handleOpenCheckpointClick}
              className="relative rounded-2xl p-6 sm:p-7 bg-[#050916] border-2 border-cyber-cyan shadow-[0_0_45px_rgba(0,240,255,0.45)] hover:shadow-[0_0_60px_rgba(0,240,255,0.7)] transition-all duration-300 group cursor-pointer"
            >
              {/* Outer Radiating Cyber Corner Glyphs */}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-cyber-cyan rounded-tl-lg pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-cyber-red rounded-tr-lg pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-cyber-cyan rounded-bl-lg pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-cyber-red rounded-br-lg pointer-events-none" />

              {/* Pulsing Beacon Halo */}
              <div className="absolute inset-0 rounded-2xl border border-cyber-cyan/50 animate-ping opacity-20 pointer-events-none" />

              {/* Header Telemetry */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyber-cyan/30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green" />
                  </span>
                  <span className="font-mono text-xs font-black tracking-widest text-cyber-cyan uppercase">
                    CHECKPOINT 01 // UNLOCKED
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full font-mono text-[10px] font-black tracking-widest uppercase bg-brand-green/20 text-brand-green border border-brand-green/50 shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                  NOW OPEN
                </span>
              </div>

              {/* Main Title & Story */}
              <div className="text-center sm:text-left mb-5">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase text-glow-cyan">
                  PHASE 01: THE SIGNAL
                </h2>
                <p className="mt-2 font-mono text-xs sm:text-sm text-white/80 leading-relaxed">
                  Your journey begins here. Step into the first signal and build your edge.
                </p>
              </div>

              {/* Telemetry Matrix Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3.5 rounded-xl bg-black/60 border border-cyber-cyan/30 mb-6 font-mono text-center">
                <div className="p-2 rounded bg-white/5">
                  <div className="text-[9px] text-white/40 uppercase">MODULE</div>
                  <div className="text-xs sm:text-sm font-bold text-white">WORKSHOP 01</div>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <div className="text-[9px] text-white/40 uppercase">ADMISSION</div>
                  <div className="text-xs sm:text-sm font-black text-cyber-cyan">FREE</div>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <div className="text-[9px] text-white/40 uppercase">STATUS</div>
                  <div className="text-xs sm:text-sm font-bold text-brand-green flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-green" />
                    VERIFIED
                  </div>
                </div>
              </div>

              {/* Prominent Official REGISTER FREE Button */}
              <a
                href={CHECKPOINTS[0].link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playAccessGranted();
                }}
                className="cyber-button group/btn relative w-full py-4 px-6 rounded-xl font-mono font-black text-sm sm:text-base tracking-[0.25em] uppercase bg-gradient-to-r from-cyber-red via-white to-cyber-cyan text-black hover:text-black shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:shadow-[0_0_50px_rgba(255,31,67,0.9)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
              >
                <span>REGISTER FREE</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-200" />
              </a>

              <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10px] text-white/50">
                <span>OFFICIAL VERIFIED UNSTOP GATEWAY</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </div>
            </div>
          </div>

          {/* =====================================================
              THE REMAINING 7 SEALED CHECKPOINTS (02 TO 08)
              ALONG THE DRAGON-GUARDED MOUNTAIN ROUTE
              ===================================================== */}
          <section className="mt-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] sm:text-xs text-white/60 tracking-widest uppercase">
                <Lock className="w-3 h-3 text-cyber-red" />
                <span>UPCOMING TRANSMISSIONS // SEALED BY THE GUARDIAN</span>
              </div>
              <h3 className="mt-2 font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                THE 8-CHECKPOINT TRAIL
              </h3>
              <p className="font-mono text-xs text-white/50 max-w-xl mx-auto mt-1">
                Subsequent checkpoints remain classified until their designated signal frequency is unsealed.
              </p>
            </div>

            {/* Desktop / Tablet Mountain Ridge Winding Trail */}
            <div className="relative">
              {/* Connecting SVG Cyber Fiber Line */}
              <svg
                className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1150 440"
                fill="none"
              >
                <path
                  d="M 90 80 L 1060 80 C 1120 80 1120 360 1060 360 L 90 360"
                  stroke={activePulseTargetId ? '#ff1f43' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  className="transition-colors duration-300"
                />
                {animReady && (
                  <path
                    d="M 90 80 L 1060 80 C 1120 80 1120 360 1060 360 L 90 360"
                    stroke={activePulseTargetId ? '#ff1f43' : '#00f0ff'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="20 180"
                    style={{
                      animation: 'signal-pulse-flow 3.5s linear infinite',
                    }}
                  />
                )}
              </svg>

              {/* Grid of Remaining Checkpoints (02 through 08) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                {CHECKPOINTS.slice(1).map((cp) => {
                  const isTarget = activePulseTargetId === cp.id;
                  const isShaking = shakingId === cp.id;
                  const isIlluminated = illuminatedSteps.includes(cp.id);

                  return (
                    <div
                      key={cp.id}
                      onClick={() => handleLockedCheckpointClick(cp.id)}
                      className={`relative flex flex-col justify-between rounded-xl p-5 bg-[#050711]/90 border transition-all duration-300 cursor-pointer select-none group min-h-[220px] ${
                        isTarget
                          ? 'border-cyber-red shadow-[0_0_35px_rgba(255,31,67,0.6)] bg-[#12060b]'
                          : 'border-white/10 hover:border-cyber-cyan/40 hover:bg-[#070b18]'
                      } ${isIlluminated ? 'opacity-90' : 'opacity-40'} ${
                        isShaking ? 'animate-card-shake' : ''
                      }`}
                      title="Click to probe checkpoint cipher"
                    >
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-lg pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 rounded-br-lg pointer-events-none" />

                      <div>
                        {/* Top Telemetry */}
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5 font-mono text-[9px] text-white/40">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-cyber-red/80" />
                            <span>{cp.phaseNumber} // CIPHER LOCKED</span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-bold">
                            ENCRYPTED
                          </span>
                        </div>

                        {/* Title: Number only */}
                        <div className="mb-3">
                          <h4 className="font-display font-black text-lg text-white/70 group-hover:text-white tracking-wide uppercase transition-colors">
                            {cp.title}
                          </h4>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-red/10 border border-cyber-red/30 text-cyber-red font-mono text-[10px] font-bold tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
                            <span>{cp.statusLabel}</span>
                          </div>
                        </div>

                        {/* Encrypted Telemetry Fragment */}
                        <div className="p-2.5 rounded bg-black/50 border border-white/5 font-mono text-[9px] text-white/40 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>FREQUENCY:</span>
                            <span className="text-white/20">███.██ MHz</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SEAL INTEGRITY:</span>
                            <span className="text-amber-500/80">GUARDIAN SEAL</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Prompt Footer */}
                      <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-white/40 group-hover:text-cyber-cyan transition-colors">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>PROBE SIGNAL</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =====================================================
              BOTTOM PROTOCOL FOOTER
              ===================================================== */}
          <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span>PHASE ZERO CLEARANCE // GUARDIAN PROTOCOL ACTIVE</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-white/80 font-bold">BORN IN THE 0. RESURRECTED IN THE 1.</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Embedded Animations */}
      <style>{`
        @keyframes signal-pulse-flow {
          0% { stroke-dashoffset: 800; }
          100% { stroke-dashoffset: 0; }
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
        @keyframes dragon-breathe {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-dragon-breathe {
          animation: dragon-breathe 4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-card-shake,
          .animate-dragon-breathe {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
   CYBER-DRAGON GUARDIAN VISUAL COMPONENT
   ========================================================================= */
interface CyberDragonVisualProps {
  mood: DragonMood;
  animReady: boolean;
}

const CyberDragonVisual: React.FC<CyberDragonVisualProps> = ({
  mood,
  animReady,
}) => {
  const isRoaring = mood === 'roaring';
  const isCelebrating = mood === 'celebrating';

  const primaryGlowColor = isRoaring ? '#ff1f43' : isCelebrating ? '#ffd700' : '#00f0ff';
  const eyeColor = isRoaring ? '#ff1f43' : isCelebrating ? '#00f0ff' : '#00f0ff';

  return (
    <div
      className={`relative w-48 h-32 sm:w-64 sm:h-40 mx-auto transition-transform duration-500 ${
        animReady ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      } ${!isRoaring ? 'animate-dragon-breathe' : 'scale-110'}`}
    >
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        <defs>
          <linearGradient id="dragonArmor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="hornGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryGlowColor} />
            <stop offset="100%" stopColor="#ff1f43" />
          </linearGradient>
        </defs>

        {/* Biomechanical Left Wing Spikes */}
        <path
          d="M 120 120 L 20 60 L 60 110 L 10 100 L 50 140 L 110 135"
          fill="url(#dragonArmor)"
          stroke={primaryGlowColor}
          strokeWidth="1.5"
          className="transition-all duration-300"
        />

        {/* Biomechanical Right Wing Spikes */}
        <path
          d="M 200 120 L 300 60 L 260 110 L 310 100 L 270 140 L 210 135"
          fill="url(#dragonArmor)"
          stroke={primaryGlowColor}
          strokeWidth="1.5"
          className="transition-all duration-300"
        />

        {/* Left Horn */}
        <path
          d="M 140 70 C 120 30 80 20 50 25 C 80 45 110 65 130 85 Z"
          fill="url(#hornGlow)"
          stroke="#ffffff"
          strokeWidth="1"
          opacity={isRoaring ? '1' : '0.85'}
        />

        {/* Right Horn */}
        <path
          d="M 180 70 C 200 30 240 20 270 25 C 240 45 210 65 190 85 Z"
          fill="url(#hornGlow)"
          stroke="#ffffff"
          strokeWidth="1"
          opacity={isRoaring ? '1' : '0.85'}
        />

        {/* Upper Crest Spikes */}
        <polygon points="160,20 152,50 168,50" fill={primaryGlowColor} />
        <polygon points="145,35 138,60 152,60" fill={primaryGlowColor} opacity="0.8" />
        <polygon points="175,35 168,60 182,60" fill={primaryGlowColor} opacity="0.8" />

        {/* Armored Dragon Head Contour */}
        <polygon
          points="160,45 195,80 180,140 160,175 140,140 125,80"
          fill="url(#dragonArmor)"
          stroke={primaryGlowColor}
          strokeWidth="2"
        />

        {/* Brow Plates */}
        <polygon points="160,65 185,85 160,95 135,85" fill="#334155" stroke="#ffffff" strokeWidth="0.5" />

        {/* Fierce Cyber Eyes (Electric Blue in normal/friendly, Laser Crimson in roar) */}
        <g className="transition-all duration-300">
          {/* Left Eye */}
          <polygon
            points="142,95 154,98 144,103"
            fill={eyeColor}
            filter="drop-shadow(0 0 6px currentColor)"
          />
          {/* Right Eye */}
          <polygon
            points="178,95 166,98 176,103"
            fill={eyeColor}
            filter="drop-shadow(0 0 6px currentColor)"
          />

          {/* Celebratory Sunburst Eye Sparks */}
          {isCelebrating && (
            <>
              <circle cx="148" cy="99" r="6" fill="#ffd700" opacity="0.6" className="animate-ping" />
              <circle cx="172" cy="99" r="6" fill="#ffd700" opacity="0.6" className="animate-ping" />
            </>
          )}
        </g>

        {/* Snout Armor & Biomechanical Grille */}
        <polygon points="152,120 168,120 160,145" fill="#0f172a" stroke={primaryGlowColor} strokeWidth="1" />
        <line x1="154" y1="126" x2="166" y2="126" stroke={primaryGlowColor} strokeWidth="1" />
        <line x1="156" y1="132" x2="164" y2="132" stroke={primaryGlowColor} strokeWidth="1" />

        {/* Jaw & Mouth Aperture */}
        {isRoaring ? (
          <g>
            {/* Open Roaring Plasma Mouth */}
            <polygon points="150,150 170,150 160,178" fill="#ff1f43" />
            <polygon points="154,152 166,152 160,170" fill="#ffffff" />
            {/* Roar Plasma Ring */}
            <circle cx="160" cy="165" r="18" stroke="#ff1f43" strokeWidth="2" className="animate-ping" opacity="0.75" />
          </g>
        ) : (
          <path d="M 152 152 L 160 156 L 168 152" stroke={primaryGlowColor} strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};
