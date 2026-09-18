import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Cloud,
  Sparkles,
  Cpu,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

export const PassesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Viewport trigger
  const [hasScrolledIn, setHasScrolledIn] = useState<boolean>(false);

  // Section Intro states
  const [introStep, setIntroStep] = useState<number>(0);
  const [introLogs, setIntroLogs] = useState<string[]>([]);
  const [binaryResolved, setBinaryResolved] = useState<boolean>(false);

  // "LET'S BEGIN" interactive button state
  const [beginBtnText, setBeginBtnText] = useState<string>("LET'S BEGIN →");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Brutal card entrance sequence states
  const [cardsAnimStep, setCardsAnimStep] = useState<number>(0);
  const [eliteShellShattered, setEliteShellShattered] = useState<boolean>(false);
  const [eliteRootFlash, setEliteRootFlash] = useState<boolean>(false);
  const [glitchPrice, setGlitchPrice] = useState<boolean>(false);

  // Hover states for the cards
  const [hoveredCard, setHoveredCard] = useState<'initiate' | 'operator' | 'elite' | null>(null);
  const [initiateHovered, setInitiateHovered] = useState<boolean>(false);
  const [operatorHovered, setOperatorHovered] = useState<boolean>(false);

  // 3D Parallax tilt coordinates
  const [eliteTilt, setEliteTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [operatorTilt, setOperatorTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Brutal Card Entrance Sequence
  const triggerCardsSequence = useCallback(() => {
    setCardsAnimStep((prev) => {
      if (prev > 0) return prev;
      return 1;
    });
    sound.playBeep(1400, 0.03, 0.03);

    // 02 & 03: Encrypted rectangular outlines appear
    const tOutlines = setTimeout(() => {
      setCardsAnimStep(2);
      sound.playBeep(900, 0.04, 0.03);
    }, 280);

    // 04 & 05: Digital fragments assemble & INITIATE materializes
    const tInitiate = setTimeout(() => {
      setCardsAnimStep(3);
      sound.playHoverClick();
    }, 550);

    // 06: OPERATOR materializes with red/cyan energy pulse
    const tOperator = setTimeout(() => {
      setCardsAnimStep(4);
      sound.playButtonConfirm();
    }, 850);

    // 07: ELITE materializes LAST with shell shatter, particle explosion, and ROOT ACCESS flash
    const tElite = setTimeout(() => {
      setCardsAnimStep(5);
      setEliteShellShattered(true);
      setEliteRootFlash(true);
      setGlitchPrice(true);
      sound.playSystemActivation();

      setTimeout(() => {
        setEliteRootFlash(false);
        setCardsAnimStep(6); // Fully operational
      }, 1100);
    }, 1150);

    return () => {
      clearTimeout(tOutlines);
      clearTimeout(tInitiate);
      clearTimeout(tOperator);
      clearTimeout(tElite);
    };
  }, []);

  // IntersectionObserver to detect arrival at #access
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasScrolledIn) {
          setHasScrolledIn(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasScrolledIn]);

  // Section Intro Cinematic Sequence
  useEffect(() => {
    if (!hasScrolledIn) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTimeout(() => {
        setIntroStep(4);
        setBinaryResolved(true);
        setCardsAnimStep(6);
        setEliteShellShattered(true);
        setGlitchPrice(true);
      }, 0);
      return;
    }

    // Step 1: Darkening + Terminal logs appear
    const t0 = setTimeout(() => {
      setIntroStep(1);
    }, 50);

    const logs = [
      '> SIGNAL DETECTED',
      '> REGISTRATION CHANNEL OPEN',
      '> ACCESS LEVELS AVAILABLE',
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setIntroLogs((prev) => [...prev, log]);
        sound.playBeep(1200 + index * 200, 0.02, 0.02);
      }, 150 + index * 120);
    });

    // Step 2: Scanning beam sweep
    const tScan = setTimeout(() => {
      setIntroStep(2);
      sound.playBeep(700, 0.08, 0.04);
    }, 600);

    // Step 3: Binary particle convergence to 0 / 1
    const tBinary = setTimeout(() => {
      setIntroStep(3);
      setBinaryResolved(true);
      sound.playClassifiedBeep();
    }, 900);

    // Step 4: Title & Intro content fully materialize
    const tTitle = setTimeout(() => {
      setIntroStep(4);
      sound.playSystemActivation();
    }, 1250);

    // Automatically trigger brutal card sequence shortly after intro appears
    const tCards = setTimeout(() => {
      triggerCardsSequence();
    }, 1600);

    return () => {
      clearTimeout(t0);
      clearTimeout(tScan);
      clearTimeout(tBinary);
      clearTimeout(tTitle);
      clearTimeout(tCards);
    };
  }, [hasScrolledIn, triggerCardsSequence]);



  // "LET'S BEGIN" interactive handler
  const handleLetsBeginClick = () => {
    sound.playButtonConfirm();
    setIsAuthenticating(true);
    setBeginBtnText('AUTHENTICATING...');

    // Fast cyber pulse & trigger card sequence if not triggered yet
    triggerCardsSequence();

    setTimeout(() => {
      setIsAuthenticating(false);
      setBeginBtnText("LET'S BEGIN →");
      if (cardsRef.current) {
        cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 320);
  };

  // Parallax handlers
  const handleEliteMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setEliteTilt({ x, y });
  };

  const handleOperatorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setOperatorTilt({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="access"
      className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#040507] text-[#e2e8f0] overflow-hidden border-t border-cyber-border/70"
    >
      {/* Anchor targets for both #passes and #registration */}
      <div id="passes" className="absolute -top-24 pointer-events-none" />
      <div id="registration" className="absolute -top-24 pointer-events-none" />

      {/* Localized cybernetic background container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid and scanline */}
        <div className="absolute inset-0 hud-grid opacity-20" />
        <div className="absolute inset-0 scanline-bg opacity-25" />

        {/* Localized subtle red / cyan lighting & neural glows */}
        <div className="absolute top-1/6 -left-36 w-80 h-80 rounded-full bg-cyber-red/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-36 w-80 h-80 rounded-full bg-cyber-cyan/10 blur-[120px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-cyber-blue/5 blur-[140px]" />

        {/* Encrypted data & cloud / neural telemetry */}
        <div className="hidden xl:block absolute top-10 left-8 font-mono text-[9px] text-white/20 tracking-widest leading-relaxed">
          <div>NODE://0x00_SIGNAL_INLET</div>
          <div>ENC://SHA-512_STREAM_ACTIVE</div>
          <div>NEURAL://AI_QUANTIZED_WEIGHTS</div>
          <div>CLOUD://EDGE_INGRESS_SECURE</div>
        </div>
        <div className="hidden xl:block absolute top-10 right-8 font-mono text-[9px] text-right text-white/20 tracking-widest leading-relaxed">
          <div>AUTH://CLEARANCE_STAGE_01</div>
          <div>ROOT://SOVEREIGN_SYSTEM</div>
          <div>PROTOCOL://ROOTIFYING_2026</div>
          <div>STATUS://ONLINE</div>
        </div>

        {/* Horizontal Scanning Beam on Intro */}
        {introStep === 2 && (
          <div className="absolute inset-x-0 top-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyber-red to-cyber-cyan shadow-[0_0_25px_#00f0ff] animate-[scanline-vertical_0.7s_ease-in-out_forwards]" />
        )}

        {/* Fast Red Laser Sweep on Card Assembly */}
        {cardsAnimStep === 1 && (
          <div className="absolute inset-x-0 top-1/3 h-[2px] bg-cyber-red shadow-[0_0_20px_#ff1f43] animate-[laser-sweep_0.6s_ease-out_forwards]" />
        )}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ===================================================
            SECTION INTRO & TERMINAL BOOT SEQUENCE
            =================================================== */}
        {introStep > 0 && introStep < 4 && (
          <div className="mb-8 max-w-lg mx-auto p-4 rounded-lg border border-cyber-cyan/30 bg-[#06080d]/95 font-mono text-xs shadow-[0_0_30px_rgba(0,240,255,0.2)] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-cyber-cyan text-[11px] font-bold">
              <Terminal className="w-3.5 h-3.5 animate-spin text-cyber-cyan" />
              <span>TERMINAL STREAM // ACCESS PROTOCOL</span>
            </div>
            <div className="space-y-1.5 text-white/80 text-[11px]">
              {introLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2 font-mono">
                  <span className="text-cyber-red font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convergence of Binary Particles into 0 / 1 */}
        {binaryResolved && (
          <div className="flex items-center justify-center gap-3 mb-4 font-mono animate-in fade-in zoom-in duration-300">
            <span className="text-2xl sm:text-3xl font-black text-cyber-red text-glow-red">0</span>
            <span className="text-lg sm:text-xl text-white/30 font-light">/</span>
            <span className="text-2xl sm:text-3xl font-black text-cyber-cyan text-glow-cyan">1</span>
          </div>
        )}

        {/* Master Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Shield className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span className="font-bold">SIGNAL AUTHENTICATION GATEWAY</span>
          </div>

          {/* Extremely Large Typography: CHOOSE YOUR (white/cyan) ACCESS LEVEL (red/cyan gradient) */}
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase leading-none">
            <span className="text-white text-glow-cyan">CHOOSE YOUR</span>{' '}
            <span className="bg-gradient-to-r from-cyber-red via-white to-cyber-cyan bg-clip-text text-transparent text-glow-red">
              ACCESS LEVEL
            </span>
          </h2>

          {/* Sub-headline micro-story */}
          <div className="mt-5 space-y-1.5 font-mono text-sm sm:text-base tracking-widest uppercase">
            <div className="text-cyber-cyan font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              <span>THE SIGNAL IS LIVE.</span>
            </div>
            <div className="text-white/80 font-bold tracking-[0.18em]">
              PRE-REGISTRATION IS OPEN.
            </div>
            <div className="text-cyber-red text-xs sm:text-sm font-semibold tracking-widest pt-1">
              FREE REGISTRATION OPENING SOON
            </div>
          </div>

          {/* ===================================================
              "LET'S BEGIN" INTERACTIVE BUTTON (INTERNAL CTA)
              =================================================== */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={handleLetsBeginClick}
              onMouseEnter={() => {
                if (!isAuthenticating) setBeginBtnText('ENTERING ACCESS →');
                sound.playHoverClick();
              }}
              onMouseLeave={() => {
                if (!isAuthenticating) setBeginBtnText("LET'S BEGIN →");
              }}
              className="relative group px-8 py-4 rounded-lg font-mono font-black text-sm tracking-[0.25em] uppercase text-white bg-gradient-to-r from-cyber-red/90 via-black to-cyber-cyan/90 border-2 border-cyber-cyan hover:border-white shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_45px_rgba(255,31,67,0.6)] transition-all duration-200 hover:scale-105 active:scale-95"
              data-cursor="access"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-red to-cyber-cyan rounded-lg opacity-40 group-hover:opacity-100 blur transition duration-300 pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <Zap className="w-4 h-4 text-cyber-cyan animate-pulse" />
                <span>[ {beginBtnText} ]</span>
              </div>
            </button>
            <span className="font-mono text-[10px] text-white/40 tracking-wider">
              CLICK TO ENTER ACCESS TERMINAL // PRE-REGISTRATION LIVE
            </span>
          </div>

          {/* Entrepreneurship Pipeline Journey Badge */}
          <div className="mt-8 flex items-center justify-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] sm:text-[11px] tracking-widest text-white/70">
            <span className="text-cyber-cyan font-bold">IDEA</span>
            <span className="text-cyber-red font-bold">↓</span>
            <span className="text-white font-bold">BUILD</span>
            <span className="text-cyber-red font-bold">↓</span>
            <span className="text-cyber-cyan font-bold">SCALE</span>
            <span className="text-cyber-red font-bold">↓</span>
            <span className="text-brand-green font-bold">IMPACT</span>
          </div>

          <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-cyber-red to-cyber-cyan my-8" />
        </div>

        {/* Terminal Indicator for Brutal Node Assembly */}
        {cardsAnimStep > 0 && cardsAnimStep < 6 && (
          <div className="mb-6 text-center font-mono text-xs text-cyber-cyan animate-pulse">
            &gt; ACCESS NODES DETECTED... ASSEMBLING SECURITY TIERS...
          </div>
        )}

        {/* ===================================================
            THE THREE PASSES CARDS CONTAINER
            =================================================== */}
        <div
          ref={cardsRef}
          id="passes-cards"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 items-stretch mb-14 sm:mb-16 scroll-mt-24"
        >
          {/* =================================================
              01 — INITIATE PASS
              ================================================= */}
          <div
            onMouseEnter={() => {
              setHoveredCard('initiate');
              setInitiateHovered(true);
              sound.playBeep(1400, 0.02, 0.02);
            }}
            onMouseLeave={() => {
              setHoveredCard(null);
              setInitiateHovered(false);
            }}
            className={`relative flex flex-col justify-between rounded-xl p-6 sm:p-8 bg-[#06080e]/95 border transition-all duration-300 select-none ${
              cardsAnimStep < 3 ? 'border-dashed border-white/20 opacity-60' : 'opacity-100'
            } ${
              initiateHovered
                ? 'border-cyber-cyan/60 shadow-[0_0_30px_rgba(0,240,255,0.2)] translate-y-[-4px]'
                : 'border-white/10 shadow-xl'
            }`}
            data-cursor="locked"
          >
            {/* Subtle cyan corner indicators */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyber-cyan/40 rounded-tl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/10 rounded-br-xl pointer-events-none" />

            {/* Subtle scanline on hover */}
            <div
              className={`absolute inset-0 scanline-bg rounded-xl pointer-events-none transition-opacity duration-300 ${
                initiateHovered ? 'opacity-35' : 'opacity-10'
              }`}
            />

            <div>
              {/* Header Telemetry */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                  LEVEL 01 // ENTRY NODE
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/20 bg-white/5 text-white/60 font-bold tracking-wider">
                  [ ACCESS PENDING ]
                </span>
              </div>

              {/* Title & Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  <span className="font-mono text-xs text-cyber-cyan font-bold tracking-widest">
                    PUBLIC CLEARANCE
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider uppercase">
                  INITIATE PASS
                </h3>
                <div className="mt-2 inline-block font-mono text-[11px] text-cyber-cyan/80 bg-cyber-cyan/10 border border-cyber-cyan/20 px-2.5 py-0.5 rounded">
                  STATUS: ACCESS PENDING
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-lg bg-black/40 border border-white/10 mb-6">
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">
                  CLEARANCE COST
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                    FREE
                  </span>
                  <span className="font-mono text-xs text-white/50">/ GENERAL ACCESS</span>
                </div>
                <div className="mt-2 font-mono text-[11px] text-white/60 font-medium">
                  FREE REGISTRATION OPENING SOON
                </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-3 mb-8">
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  INCLUDED PERKS & ACCESS
                </div>
                <ul className="space-y-2.5 font-mono text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Access to Live Sessions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Participation Certificate</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Locked CTA Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                disabled
                onClick={() => {
                  sound.playHoverClick();
                }}
                className="w-full py-4 px-4 rounded-lg font-mono font-bold text-xs tracking-widest uppercase border border-white/20 bg-white/5 text-white/50 cursor-not-allowed flex items-center justify-center gap-2.5 opacity-75 select-none transition-all"
                title="Free registration opening soon"
              >
                <Lock className="w-3.5 h-3.5 text-white/40" />
                <span>FREE REGISTRATION OPENING SOON</span>
              </button>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] text-white/40 px-1">
                <span>AUTHENTICATION: SUSPENDED</span>
                <span>QUEUE: PRE-LAUNCH</span>
              </div>
            </div>
          </div>

          {/* =================================================
              02 — OPERATOR PASS
              ================================================= */}
          <div
            onMouseMove={handleOperatorMouseMove}
            onMouseEnter={() => {
              setHoveredCard('operator');
              setOperatorHovered(true);
              sound.playBeep(1800, 0.02, 0.02);
            }}
            onMouseLeave={() => {
              setHoveredCard(null);
              setOperatorHovered(false);
              setOperatorTilt({ x: 0, y: 0 });
            }}
            style={{
              transform: `perspective(1000px) rotateX(${operatorTilt.y}deg) rotateY(${operatorTilt.x}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className={`relative flex flex-col justify-between rounded-xl p-6 sm:p-8 bg-[#070b14]/95 border transition-all duration-300 select-none ${
              cardsAnimStep < 4 ? 'border-dashed border-white/20 opacity-60' : 'opacity-100'
            } ${
              hoveredCard === 'operator'
                ? 'border-cyber-cyan shadow-[0_0_35px_rgba(0,240,255,0.35)] bg-[#09101c]'
                : 'border-cyber-cyan/40 shadow-xl'
            }`}
            data-cursor="access"
          >
            {/* Cyber Corner Cuts */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyber-red rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyber-cyan rounded-bl-xl pointer-events-none" />

            {/* Accelerated red / cyan data streams on hover */}
            <div
              className={`absolute inset-0 scanline-bg rounded-xl pointer-events-none transition-opacity duration-300 ${
                operatorHovered ? 'opacity-35' : 'opacity-15'
              }`}
            />

            <div>
              {/* Header Telemetry */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-cyber-cyan/20">
                <span className="font-mono text-[10px] text-cyber-cyan font-bold tracking-widest uppercase">
                  LEVEL 02 // OPERATIONAL
                </span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded border border-cyber-cyan/50 bg-cyber-cyan/15 text-cyber-cyan font-bold tracking-wider animate-pulse">
                  [ SIGNAL VERIFIED ]
                </span>
              </div>

              {/* Title & Badge */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-extrabold uppercase bg-cyber-red/20 text-cyber-red border border-cyber-red/50 shadow-[0_0_12px_rgba(255,31,67,0.3)]">
                    EARLY ACCESS
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider uppercase">
                  OPERATOR PASS
                </h3>
                <p className="mt-1 font-mono text-[11px] text-white/60">
                  Full operator clearance and advanced ecosystem resources.
                </p>
              </div>

              {/* Price Display with Struck-Through original & Glitch Transition */}
              <div className="p-4 rounded-lg bg-black/60 border border-cyber-cyan/30 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2 py-1 rounded-bl bg-cyber-red/20 border-l border-b border-cyber-red/40 font-mono text-[10px] font-bold text-cyber-red">
                  SAVE ₹50
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">
                  TIER PRICE
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="line-through text-white/40 font-mono text-xl sm:text-2xl font-bold">
                    ₹99
                  </span>
                  <span
                    className={`font-display font-black text-4xl sm:text-5xl text-cyber-cyan text-glow-cyan tracking-tight transition-all duration-300 ${
                      glitchPrice ? 'scale-105' : ''
                    }`}
                  >
                    ₹49
                  </span>
                  <span className="font-mono text-xs text-cyber-cyan/70 font-semibold">
                    / PASS
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-white/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  <span>PRE-REGISTRATION SPECIAL // PRICE INCREASES AT FULL LAUNCH</span>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="space-y-3 mb-8">
                <div className="font-mono text-[10px] text-cyber-cyan/70 uppercase tracking-widest pb-1 border-b border-white/5 flex items-center justify-between">
                  <span>INCLUDED PRIVILEGES</span>
                  <span className="text-[9px] text-white/40">6 MODULES</span>
                </div>
                <ul className="space-y-2.5 font-mono text-xs text-white/90">
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Everything in Initiate Pass</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span className="text-white font-semibold">Operator Recognition Certificate</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Summary Guides</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Priority Updates for Future Sessions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Standard Experience Perks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-cyber-cyan mt-0.5 font-bold">✓</span>
                    <span>Limited Community Access</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Button -> Exact Commudle Link */}
            <div className="pt-4 border-t border-cyber-cyan/20">
              <a
                href="https://www.commudle.com/fill-form/5141"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playButtonConfirm()}
                className="group relative w-full py-4 px-5 rounded-lg font-mono font-bold text-xs sm:text-sm tracking-widest uppercase border border-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
                data-cursor="enter"
              >
                <span>GET OPERATOR ACCESS →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] text-white/40 px-1">
                <span>GATEWAY: COMMUDLE // SECURE</span>
                <span className="text-cyber-cyan">IMMEDIATE CONFIRMATION</span>
              </div>
            </div>
          </div>

          {/* =================================================
              03 — ELITE PASS (The Root Access Masterpiece)
              ================================================= */}
          <div
            onMouseMove={handleEliteMouseMove}
            onMouseEnter={() => {
              setHoveredCard('elite');
              sound.playBeep(2200, 0.02, 0.02);
            }}
            onMouseLeave={() => {
              setHoveredCard(null);
              setEliteTilt({ x: 0, y: 0 });
            }}
            style={{
              transform: `perspective(1000px) rotateX(${eliteTilt.y}deg) rotateY(${eliteTilt.x}deg) translateY(${
                hoveredCard === 'elite' ? '-8px' : '0px'
              })`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
            }}
            className={`relative flex flex-col justify-between rounded-xl p-6 sm:p-8 bg-[#0c0812]/95 border-2 transition-all duration-300 select-none ${
              cardsAnimStep < 5 ? 'border-dashed border-white/20 opacity-60' : 'opacity-100'
            } ${
              hoveredCard === 'elite'
                ? 'border-cyber-red shadow-[0_0_50px_rgba(255,31,67,0.5)] bg-[#120a1c]'
                : 'border-cyber-red/60 shadow-[0_0_30px_rgba(255,31,67,0.25)]'
            }`}
            data-cursor="root"
          >
            {/* Animated Energy Border Pulse (Red -> White -> Cyan) */}
            <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-red via-white to-cyber-cyan opacity-25 blur-sm animate-pulse" />
              {/* Vertical Holographic Sweep Line on Hover */}
              {hoveredCard === 'elite' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-75 shadow-[0_0_15px_#ff1f43] animate-[scanline-vertical_1.2s_linear_infinite]" />
              )}
            </div>

            {/* Encrypted Shell Shatter Effect */}
            {cardsAnimStep === 5 && !eliteShellShattered && (
              <div className="absolute inset-0 z-20 rounded-xl bg-black/80 border-2 border-cyber-red/80 animate-[shell-shatter_0.8s_ease-out_forwards] pointer-events-none" />
            )}

            {/* Root Access Flash Notification */}
            {eliteRootFlash && (
              <div className="absolute inset-0 z-30 rounded-xl bg-cyber-red/20 backdrop-blur-[2px] flex items-center justify-center font-mono text-sm sm:text-base font-black tracking-widest text-white animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 rounded bg-black/90 border border-cyber-red shadow-[0_0_30px_rgba(255,31,67,0.8)] text-center">
                  <div className="text-cyber-red text-glow-red">ROOT ACCESS</div>
                  <div className="text-white text-xs">AUTHORIZED // CLEARANCE GRANTED</div>
                </div>
              </div>
            )}

            <div>
              {/* Header Telemetry */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-cyber-red/30 relative z-10">
                <span className="font-mono text-[10px] text-cyber-red font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyber-red animate-spin" />
                  <span>LEVEL 03 // ROOT COMMAND</span>
                </span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded border border-cyber-red bg-cyber-red/20 text-white font-extrabold tracking-widest shadow-[0_0_15px_rgba(255,31,67,0.5)]">
                  [ ROOT ACCESS ]
                </span>
              </div>

              {/* Badges & Title */}
              <div className="mb-6 relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-black uppercase bg-gradient-to-r from-cyber-red to-amber-500 text-white border border-cyber-red shadow-[0_0_15px_rgba(255,31,67,0.4)]">
                    MOST PREMIUM
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40">
                    EARLY ACCESS
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider uppercase text-glow-red">
                  ELITE PASS
                </h3>
                <p className="mt-1 font-mono text-[11px] text-white/70">
                  Unrestricted sovereign access, private mastermind rooms, physical swag & VIP treatment.
                </p>
              </div>

              {/* Price Display with Struck-Through original & Glitch Transition */}
              <div className="p-4 rounded-lg bg-black/75 border border-cyber-red/40 mb-6 relative overflow-hidden z-10">
                <div className="absolute top-0 right-0 px-2.5 py-1 rounded-bl bg-brand-green/20 border-l border-b border-brand-green/50 font-mono text-[10px] font-extrabold text-brand-green">
                  SAVE ₹500
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">
                  ROOT CLEARANCE COST
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="line-through text-white/40 font-mono text-xl sm:text-2xl font-bold">
                    ₹999
                  </span>
                  <span
                    className={`font-display font-black text-5xl sm:text-6xl text-white text-glow-red tracking-tight transition-all duration-300 ${
                      hoveredCard === 'elite' ? 'scale-105 text-cyber-red' : ''
                    }`}
                  >
                    ₹499
                  </span>
                  <span className="font-mono text-xs text-cyber-red font-bold">
                    / VIP PASS
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" />
                  <span className="font-semibold text-white/80">
                    CURRENT EARLY-ACCESS RATE // LIMITED ALLOTMENT
                  </span>
                </div>
              </div>

              {/* All 11 Benefits Section */}
              <div className="space-y-3 mb-8 relative z-10">
                <div className="font-mono text-[10px] text-cyber-red uppercase tracking-widest pb-1 border-b border-cyber-red/20 flex items-center justify-between">
                  <span>FULL ROOT PRIVILEGES</span>
                  <span className="text-[9px] text-white/50">11 EXCLUSIVE MODULES</span>
                </div>
                <ul className="space-y-2 font-mono text-[11px] sm:text-xs text-white/95">
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span className="text-white font-bold">Everything in Initiate + Operator Pass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span className="text-cyber-cyan font-semibold">VIP Event Experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Special Live Q/A Sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span className="text-brand-green font-semibold">Premium Community Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span className="text-yellow-400 font-bold">Physical Goodies & Swag Pack</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Priority Access to Future Sessions & Events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Exclusive Discounts on Upcoming Experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Premium Digital Resources & Paid Subscriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Limited-Time Workshop Recording Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span>Future Guidance & Growth Opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyber-red mt-0.5 font-bold">✓</span>
                    <span className="text-white font-extrabold">Elite Recognition Certificate</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Elite CTA Button -> Exact Commudle Link */}
            <div className="pt-4 border-t border-cyber-red/30 relative z-10">
              <a
                href="https://www.commudle.com/fill-form/5142"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playSystemActivation()}
                className="group relative w-full py-4 px-5 rounded-lg font-mono font-black text-xs sm:text-sm tracking-widest uppercase bg-gradient-to-r from-cyber-red to-cyber-red/90 hover:from-cyber-red hover:to-white text-white hover:text-black flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(255,31,67,0.4)] hover:shadow-[0_0_40px_rgba(255,31,67,0.8)]"
                data-cursor="root"
              >
                <span>ENTER ELITE ACCESS →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] text-white/50 px-1">
                <span className="text-cyber-red font-bold">ROOT AUTHENTICATION // 0x01</span>
                <span>SECURE COMMUDLE GATEWAY</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            PRE-REGISTRATION CINEMATIC BANNER (BELOW CARDS)
            =================================================== */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-[#06080e] border border-cyber-cyan/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden mb-14">
          <div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-red/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 font-mono text-[10px] sm:text-xs tracking-widest text-cyber-cyan uppercase font-bold">
                <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
                <span>PRE-REGISTRATION ACCESS // ACTIVE WINDOW</span>
              </div>

              <h4 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                CURRENT EARLY-ACCESS PRICING
              </h4>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 font-mono text-sm sm:text-base">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 border border-cyber-cyan/30">
                  <span className="text-white/60 text-xs uppercase font-semibold">OPERATOR:</span>
                  <span className="line-through text-white/40 text-xs">₹99</span>
                  <span className="text-cyber-cyan font-black text-lg">→ ₹49</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/60 border border-cyber-red/40">
                  <span className="text-white/60 text-xs uppercase font-semibold">ELITE:</span>
                  <span className="line-through text-white/40 text-xs">₹999</span>
                  <span className="text-cyber-red font-black text-lg">→ ₹499</span>
                </div>
              </div>

              <div className="mt-4 font-mono text-xs sm:text-sm text-cyber-red font-bold tracking-wider uppercase flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
                <span>FULL-LAUNCH PRICES WILL INCREASE.</span>
              </div>

              <p className="mt-1 font-mono text-xs text-white/50">
                Secure early access before the full launch. All passes backed by sovereign cryptographic verification.
              </p>
            </div>

            {/* Direct Quick-Action Links */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href="https://www.commudle.com/fill-form/5142"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playSystemActivation()}
                className="px-6 py-3 rounded-lg font-mono font-bold text-xs tracking-widest uppercase bg-cyber-red hover:bg-white text-white hover:text-black border border-cyber-red transition-all duration-200 text-center shadow-[0_0_20px_rgba(255,31,67,0.3)]"
                data-cursor="root"
              >
                SECURE ELITE PASS (₹499) →
              </a>
              <a
                href="https://www.commudle.com/fill-form/5141"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playButtonConfirm()}
                className="px-6 py-3 rounded-lg font-mono font-bold text-xs tracking-widest uppercase bg-cyber-cyan/15 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border border-cyber-cyan/50 transition-all duration-200 text-center"
                data-cursor="access"
              >
                SECURE OPERATOR PASS (₹49) →
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================
            FINAL ACCESS MESSAGE (REQUIREMENT 11)
            =================================================== */}
        <div className="text-center py-10 px-4 rounded-xl border border-white/10 bg-[#06080d]/80 font-mono">
          <div className="inline-block px-3 py-1 rounded border border-cyber-red/40 bg-cyber-red/10 text-cyber-red text-xs font-black tracking-[0.25em] uppercase mb-4">
            SYSTEM DIRECTIVE
          </div>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-white tracking-widest uppercase text-glow-cyan mb-4">
            ACCESS THE SIGNAL.
          </h3>
          <p className="font-mono text-sm sm:text-base text-white/80 max-w-md mx-auto leading-relaxed space-y-1">
            <span className="block">“Choose your level.</span>
            <span className="block">Enter the experience.</span>
            <span className="block text-cyber-cyan font-bold">Go to the root.”</span>
          </p>

          <div className="w-16 h-[1px] bg-white/20 mx-auto my-6" />

          <div className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-white/50 uppercase">
            <span className="text-cyber-red font-bold">0</span>
            <span className="text-white/20 mx-2">→</span>
            <span className="text-white/80">SIGNAL</span>
            <span className="text-white/20 mx-2">→</span>
            <span className="text-cyber-cyan font-bold">ACCESS</span>
            <span className="text-white/20 mx-2">→</span>
            <span className="text-brand-green font-bold">ROOT</span>
          </div>
        </div>

        {/* Distributed Ecosystem Node Telemetry (Cloud / AI / Cybersecurity / Startup) */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-white/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyber-cyan" />
              <span>AI INFERENCE NODE</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-cyber-blue" />
              <span>CLOUD TOPOLOGY ACTIVE</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-brand-green" />
              <span>SECURITY VERIFIED</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/50">
            <span>TRANSFORMATION PROTOCOL:</span>
            <span className="text-white font-bold">FILTERING ZEROES // ROOTIFYING 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
