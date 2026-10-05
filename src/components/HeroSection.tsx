import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Terminal, Brain, ShieldAlert, Cloud, Rocket, Network } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHoverWorld, setActiveHoverWorld] = useState<string | null>(null);
  const [entryStage, setEntryStage] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 6;
    }
    return 0;
  });
  const hasStartedRef = useRef(false);

  // Parallax tracker
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Cinematic 3-5s entry sequence with prefers-reduced-motion support
  useEffect(() => {
    if (entryStage === 6 || hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Sequence stages:
    // 1: 0 appears (250ms)
    // 2: 1 appears (750ms)
    // 3: Connecting lines & vector establish (1300ms)
    // 4: Hacker cyber visual reveals (1900ms)
    // 5: Glitch title & sliding ROOTIFYING (2500ms)
    // 6: Tagline & CTA button reveal (3100ms)
    const t1 = setTimeout(() => {
      setEntryStage(1);
      sound.playBeep(420, 0.03, 0.04);
    }, 250);

    const t2 = setTimeout(() => {
      setEntryStage(2);
      sound.playBeep(840, 0.03, 0.04);
    }, 750);

    const t3 = setTimeout(() => {
      setEntryStage(3);
      sound.playClassifiedBeep();
    }, 1300);

    const t4 = setTimeout(() => {
      setEntryStage(4);
      sound.playSystemActivation();
    }, 1900);

    const t5 = setTimeout(() => {
      setEntryStage(5);
      sound.playBeep(1100, 0.04, 0.05);
    }, 2500);

    const t6 = setTimeout(() => {
      setEntryStage(6);
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [entryStage]);

  // Background 0 -> 1 Particle Canvas with Interconnecting Synapses
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      char: '0' | '1';
      size: number;
      alpha: number;
      color: string;
      flipCooldown: number;
    }

    const particles: Particle[] = [];
    const count = Math.min(85, Math.floor((width * height) / 14000));

    for (let i = 0; i < count; i++) {
      const isOne = Math.random() > 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        char: isOne ? '1' : '0',
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.45 + 0.15,
        color: isOne ? '#00f0ff' : '#ff1f43',
        flipCooldown: Math.floor(Math.random() * 180),
      });
    }

    let animationId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(4, 5, 7, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const len = particles.length;

      // Update positions and 0 -> 1 transformation
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.x += p.vx + mousePos.x * 0.15;
        p.y += p.vy + mousePos.y * 0.15;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Dynamic 0 <-> 1 bit transformation
        p.flipCooldown++;
        if (p.flipCooldown > 160 + (i % 50)) {
          p.char = p.char === '0' ? '1' : '0';
          p.color = p.char === '1' ? '#00f0ff' : '#ff1f43';
          p.flipCooldown = 0;
        }

        // Draw connections between proximate particles
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 4900) {
            // ~70px distance
            const alpha = (1 - Math.sqrt(distSq) / 70) * 0.14;
            ctx.strokeStyle =
              p.char === '1' || p2.char === '1'
                ? `rgba(0, 240, 255, ${alpha})`
                : `rgba(255, 31, 67, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Render particle glyph / node
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (i % 2 === 0) {
          ctx.font = '11px monospace';
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  const domainHoverDetails = [
    { id: 'ai', label: 'AI', desc: 'NEURAL NETWORKS & AUTONOMY', icon: Brain, color: '#00f0ff' },
    { id: 'cyber', label: 'CYBER', desc: 'OFFENSIVE HARDENING & DEFENSE', icon: ShieldAlert, color: '#ff1f43' },
    { id: 'cloud', label: 'CLOUD', desc: 'HYPERSCALE ARCHITECTURE', icon: Cloud, color: '#0070f3' },
    { id: 'web3', label: 'WEB3', desc: 'DECENTRALIZED PROTOCOLS', icon: Network, color: '#a855f7' },
    { id: 'ent', label: 'VENTURE', desc: 'FOUNDER CRAFT & SCALE', icon: Rocket, color: '#00e676' },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Atmospheric ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyber-red/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyber-cyan/15 blur-[140px] pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
          <span className="text-white/80 font-bold tracking-widest">
            GUARDIAN OF THE ROOT // SYSTEM ACTIVE
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>LAT: 0x00</span>
          <span>LON: 0x01</span>
          <span className="text-cyber-cyan font-bold">MODE: TRANSCENDENT</span>
        </div>
      </div>

      {/* Main Cinematic Grid: Left = The Skull Guardian of the Root, Right = Master Typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ==============================================================
            LEFT / CENTER: THE EDITORIAL CYBER HACKER & GUARDIAN OF THE ROOT
            ============================================================== */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div
            className={`relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-cyber-surface/60 shadow-[0_0_60px_rgba(255,31,67,0.25)] group transition-all duration-700 ease-out ${
              entryStage >= 4 ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-95 blur-sm'
            }`}
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
            }}
            data-cursor="explore"
          >
            {/* The Master Visual of the Editorial Cyber Hacker Controlling the Multidisciplinary Worlds */}
            <img
              src="/assets/hero/hero_cyber_hacker.jpg"
              alt="FILTERING ZEROES: ROOTIFYING - Cyber Architecture & Guardian of the Root"
              className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Subtle scanline & vignette */}
            <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Holographic scanner beam during entrance */}
            {entryStage >= 4 && entryStage < 6 && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_20px_#00f0ff] animate-[scanline-vertical_1.5s_linear_infinite] pointer-events-none" />
            )}

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-[10px] text-white/70">
              <span className="bg-black/85 px-2.5 py-1 rounded border border-cyber-cyan/40 tracking-widest text-cyber-cyan flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
                // GUARDIAN OF THE ROOT
              </span>
              <span className="bg-black/70 px-2 py-0.5 rounded text-white/60 tracking-wider">
                0 &rarr; ROOT &rarr; 1
              </span>
            </div>
          </div>

          {/* Interactive Worlds Quick Badges underneath */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full max-w-lg mt-4 font-mono text-[10px]">
            {domainHoverDetails.map((dom) => {
              const Icon = dom.icon;
              return (
                <div
                  key={dom.id}
                  onMouseEnter={() => {
                    setActiveHoverWorld(dom.id);
                    sound.playHoverClick();
                  }}
                  onMouseLeave={() => setActiveHoverWorld(null)}
                  className={`p-2 rounded border bg-cyber-surface/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeHoverWorld === dom.id
                      ? 'border-white text-white shadow-lg -translate-y-1'
                      : 'border-white/10 text-white/60 hover:border-white/30'
                  }`}
                  style={{
                    borderColor: activeHoverWorld === dom.id ? dom.color : undefined,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: dom.color }} />
                  <span className="font-bold tracking-wider">{dom.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==============================================================
            RIGHT: MASTER EVENT TITLE & MANIFESTO CUE
            ============================================================== */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <div
            className={`inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-white/15 bg-cyber-surface/80 backdrop-blur-md mb-6 hover:border-white/30 transition-all duration-500 cursor-default ${
              entryStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
            data-cursor="explore"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-red"></span>
            </span>
            <span className="font-mono text-xs font-semibold tracking-widest text-white/90">
              // A NEW ERA BEGINS
            </span>
            <span className="font-mono text-xs text-white/40">|</span>
            <span className="font-mono text-xs font-bold text-cyber-cyan">0 / 1</span>
          </div>

          <h1
            className={`font-display font-black text-4xl sm:text-6xl xl:text-7xl tracking-tighter text-white leading-none uppercase transition-all duration-700 ${
              entryStage >= 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">
              FILTERING ZEROES:
            </span>
            <span className="block mt-2 tracking-widest text-white text-glow-cyan">
              ROOTIFYING
            </span>
          </h1>

          {/* Core Identity 0 / 1 with Connecting Lines Animation */}
          <div className="relative flex items-center gap-4 sm:gap-6 my-6 font-mono">
            {/* 0 */}
            <span
              className={`text-3xl sm:text-5xl font-black text-cyber-red text-glow-red transition-all duration-500 ${
                entryStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              0
            </span>

            {/* Connecting Line Vector */}
            <div className="relative flex items-center justify-center w-16 sm:w-24">
              <div
                className={`h-[2px] bg-gradient-to-r from-cyber-red via-white to-cyber-cyan transition-all duration-700 ${
                  entryStage >= 3 ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
              <span
                className={`absolute text-[11px] font-mono text-white/60 tracking-widest transition-opacity duration-500 bg-[#040507] px-1 ${
                  entryStage >= 3 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                ROOT
              </span>
            </div>

            {/* 1 */}
            <span
              className={`text-3xl sm:text-5xl font-black text-cyber-cyan text-glow-cyan transition-all duration-500 ${
                entryStage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              1
            </span>
          </div>

          {/* Hero Quote */}
          <p
            className={`font-serif italic text-xl sm:text-2xl text-white/90 tracking-wide max-w-xl leading-relaxed transition-all duration-700 ${
              entryStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            “Born in the 0. Resurrected in the 1.”
          </p>

          {/* Multi-Phase Technology Domains Subtitle */}
          <div
            className={`mt-4 font-mono text-xs sm:text-sm tracking-[0.16em] text-white/70 uppercase transition-all duration-700 flex flex-wrap items-center ${
              entryStage >= 6 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-cyber-cyan font-bold">AI</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-cyber-red font-bold">CYBER</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-cyber-cyan font-bold">CLOUD</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-purple-400 font-bold">WEB3</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-brand-green font-bold">ENTREPRENEURSHIP</span>
          </div>

          {/* CTAs reveal last */}
          <div
            className={`mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transition-all duration-700 ${
              entryStage >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <a
              href="#access"
              onClick={(e) => {
                e.preventDefault();
                sound.playButtonConfirm();
                const el = document.getElementById('access');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto relative group inline-flex items-center justify-center select-none"
              data-cursor="access"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-red via-white to-cyber-cyan rounded opacity-75 group-hover:opacity-100 blur transition-all duration-300 animate-pulse" />
              <div className="relative w-full sm:w-auto px-8 py-3.5 bg-[#040507] border-2 border-cyber-cyan hover:border-cyber-red rounded font-mono font-black text-xs sm:text-sm tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all duration-200 group-hover:scale-[1.02] shadow-[0_0_25px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_35px_rgba(255,31,67,0.6)]">
                <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
                <span className="tracking-widest">REGISTER NOW</span>
                <span className="text-cyber-cyan group-hover:translate-x-1 transition-transform font-black">→</span>
              </div>
            </a>

            <a
              href="#partner"
              className="w-full sm:w-auto px-7 py-3.5 border border-cyber-red/60 bg-cyber-red/10 hover:bg-cyber-red hover:text-white rounded font-mono font-bold text-xs sm:text-sm tracking-[0.15em] text-cyber-red transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,31,67,0.2)]"
              data-cursor="enter"
              onClick={() => sound.playButtonConfirm()}
            >
              <span>BECOME A COMMUNITY PARTNER</span>
              <span className="text-xs">&darr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Cue */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="hover:text-cyber-cyan transition-colors flex items-center gap-1 text-[11px]"
            data-cursor="access"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>PRESS [~] FOR TERMINAL COMMAND CENTER</span>
          </button>
        </div>

        <a
          href="#manifesto"
          className="flex items-center gap-2 text-white/60 hover:text-cyber-cyan transition-colors animate-bounce"
          data-cursor="explore"
        >
          <span>DISCOVER THE SIGNAL</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>

        <div className="text-[11px] text-right hidden sm:block">
          <span>SKULL &rarr; SIGNAL &rarr; ROOT &rarr; SYSTEM &rarr; 1</span>
        </div>
      </div>
    </section>
  );
};
