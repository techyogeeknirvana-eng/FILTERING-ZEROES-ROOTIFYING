import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Terminal, Brain, ShieldAlert, Cloud, Rocket } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onOpenTerminal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHoverWorld, setActiveHoverWorld] = useState<string | null>(null);

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

  // Background Particle Canvas
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
      char: string;
      size: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const chars = ['0', '1', '0x0', 'ROOT', '1', '0'];

    for (let i = 0; i < 90; i++) {
      const isRed = Math.random() > 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        char: chars[Math.floor(Math.random() * chars.length)],
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        color: isRed ? '#ff1f43' : '#00f0ff',
      });
    }

    let animationId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(4, 5, 7, 0.25)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx + mousePos.x * 0.2;
        p.y += p.vy + mousePos.y * 0.2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        if (idx % 2 === 0) {
          ctx.font = '10px monospace';
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos]);

  const domainHoverDetails = [
    { id: 'ai', label: 'AI', desc: 'NEURAL NETWORK BRAIN', icon: Brain, color: '#00f0ff' },
    { id: 'cyber', label: 'CYBER', desc: 'GLOBAL DEFENSE MATRIX', icon: ShieldAlert, color: '#ff1f43' },
    { id: 'cloud', label: 'CLOUD', desc: 'HYPERSCALE TOWERS', icon: Cloud, color: '#0070f3' },
    { id: 'ent', label: 'ENTREPRENEURSHIP', desc: 'FUTURISTIC CITY EXPANSION', icon: Rocket, color: '#00e676' },
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
            LEFT / CENTER: THE HOODED CYBER SKULL GUARDIAN OF THE 4 WORLDS
            ============================================================== */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div
            className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-cyber-surface/60 shadow-[0_0_60px_rgba(255,31,67,0.25)] group transition-transform duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
            }}
            data-cursor="explore"
          >
            {/* The Master Visual of the Skull Guardian Controlling the 4 Worlds */}
            <img
              src="/assets/skull/skull_hero_guardian.jpg"
              alt="Guardian of the Root controlling AI, Cyber, Cloud, Entrepreneurship"
              className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Subtle scanline & vignette */}
            <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Glowing Red Eyes Subtle Tracking */}
            <div
              className="absolute top-[32%] left-[48%] w-3 h-3 rounded-full bg-cyber-red shadow-[0_0_20px_#ff0033] animate-pulse pointer-events-none"
              style={{
                transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
              }}
            />
            <div
              className="absolute top-[32%] right-[48%] w-3 h-3 rounded-full bg-cyber-red shadow-[0_0_20px_#ff0033] animate-pulse pointer-events-none"
              style={{
                transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
              }}
            />

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono text-[10px] text-white/70">
              <span className="bg-black/80 px-2 py-0.5 rounded border border-white/10 tracking-widest text-cyber-cyan">
                // GUARDIAN OF THE ROOT
              </span>
              <span className="text-white/40 tracking-wider">
                0 &rarr; ROOT &rarr; 1
              </span>
            </div>
          </div>

          {/* Interactive 4 Worlds Quick Badges underneath */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-lg mt-4 font-mono text-[11px]">
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
                  className={`p-2 rounded border bg-cyber-surface/60 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer ${
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
            className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-white/15 bg-cyber-surface/80 backdrop-blur-md mb-6 hover:border-white/30 transition-all cursor-default"
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

          <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl tracking-tighter text-white leading-none uppercase">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">
              FILTERING ZEROES:
            </span>
            <span className="block mt-2 tracking-widest text-white text-glow-cyan">
              ROOTIFYING
            </span>
          </h1>

          {/* Core Identity 0 / 1 */}
          <div className="flex items-center gap-6 my-6 font-mono">
            <span className="text-3xl sm:text-5xl font-black text-cyber-red text-glow-red">0</span>
            <span className="text-xl sm:text-3xl text-white/30 font-light">/</span>
            <span className="text-3xl sm:text-5xl font-black text-cyber-cyan text-glow-cyan">1</span>
          </div>

          {/* Hero Quote */}
          <p className="font-serif italic text-xl sm:text-2xl text-white/90 tracking-wide max-w-xl leading-relaxed">
            “Born in the 0. Resurrected in the 1.”
          </p>

          {/* Four Domains Subtitle */}
          <div className="mt-4 font-mono text-xs sm:text-sm tracking-[0.2em] text-white/70 uppercase">
            <span className="text-cyber-cyan font-bold">AI</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-cyber-red font-bold">CYBER</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-cyber-cyan font-bold">CLOUD</span>
            <span className="text-white/30 mx-2">×</span>
            <span className="text-brand-green font-bold">ENTREPRENEURSHIP</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div
              className="w-full sm:w-auto relative group"
              data-cursor="locked"
              onClick={() => sound.playBeep(440, 0.05, 0.08)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-red to-cyber-cyan rounded opacity-40 group-hover:opacity-100 blur transition duration-300"></div>
              <button className="relative w-full sm:w-auto px-7 py-3.5 bg-[#040507] border border-white/20 rounded font-mono font-bold text-xs sm:text-sm tracking-[0.2em] text-white flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                <span>COMING SOON</span>
                <span className="text-[10px] text-white/50 border border-white/20 px-1.5 py-0.5 rounded">
                  [ LOCKED ]
                </span>
              </button>
            </div>

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
