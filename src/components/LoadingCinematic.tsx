import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

interface LoadingCinematicProps {
  onComplete: () => void;
}

export const LoadingCinematic: React.FC<LoadingCinematicProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<
    'heartbeat' | 'redline' | 'swordForge' | 'slash' | 'domains' | 'merge' | 'titles' | 'fadeout'
  >('heartbeat');
  const [domainStep, setDomainStep] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Timed Sequence for the Blade Forging & Powerful Horizontal Slash
  useEffect(() => {
    // 0s: Heartbeat & Boot Sound
    sound.playSubBassRumble();
    sound.playHeartbeat(0.9);

    const t0b = setTimeout(() => {
      sound.playHeartbeat(1.2);
    }, 900);

    // 1.5s: Thin Red Line
    const t1 = setTimeout(() => {
      setPhase('redline');
      sound.playBeep(440, 0.1, 0.08);
    }, 1500);

    // 2.2s: Sword / Blade Forging from Particles & Red Energy
    const t2 = setTimeout(() => {
      setPhase('swordForge');
      sound.playBladeHum();
      sound.playTensionRise();
    }, 2200);

    // 4.2s: Powerful Horizontal Slash across screen
    const t3 = setTimeout(() => {
      setPhase('slash');
      sound.playSlashWhoosh();
      sound.playBinaryGlitchBurst();
    }, 4200);

    // 4.8s: Four Domains Reveal behind the slash
    const t4 = setTimeout(() => {
      setPhase('domains');
      setDomainStep(0);
      sound.playDomainReveal(440); // AI
    }, 4800);

    const t4b = setTimeout(() => {
      setDomainStep(1);
      sound.playDomainReveal(554.37); // CYBER
    }, 5300);

    const t4c = setTimeout(() => {
      setDomainStep(2);
      sound.playDomainReveal(659.25); // CLOUD
    }, 5800);

    const t4d = setTimeout(() => {
      setDomainStep(3);
      sound.playDomainReveal(880); // ENTREPRENEURSHIP
    }, 6300);

    // 6.9s: Merge into 0 / 1
    const t5 = setTimeout(() => {
      setPhase('merge');
      sound.playZeroToOneTransformation();
    }, 6900);

    // 7.8s: Reveal Titles: FILTERING ZEROES: ROOTIFYING
    const t6 = setTimeout(() => {
      setPhase('titles');
      sound.playAtmosphericSwell();
    }, 7800);

    // 9.2s: Fadeout to Homepage
    const t7 = setTimeout(() => {
      setPhase('fadeout');
    }, 9200);

    const t8 = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => {
      clearTimeout(t0b);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t4b);
      clearTimeout(t4c);
      clearTimeout(t4d);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [onComplete]);

  // Particle Blade Forging & Slash Trail Canvas
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
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      char: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const binaryChars = ['0', '1', '0x0', 'ROOT', 'SYN', '0', '1', '1'];

    const bladeLength = Math.min(width * 0.75, 620);
    const centerX = width / 2;
    const centerY = height / 2;
    const bladeStartX = centerX - bladeLength / 2;

    for (let i = 0; i < 260; i++) {
      const p = i / 260;
      const targetX = bladeStartX + p * bladeLength;
      const thickness = (1 - Math.pow(p - 0.25, 2)) * 18;
      const offsetY = (Math.random() - 0.5) * thickness;
      const targetY = centerY + offsetY;

      particles.push({
        x: centerX + (Math.random() - 0.5) * width * 0.9,
        y: centerY + (Math.random() - 0.5) * height * 0.9,
        targetX,
        targetY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.25 ? '#ff1f43' : '#00f0ff',
        char: binaryChars[Math.floor(Math.random() * binaryChars.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let animationFrameId: number;
    let forgeProgress = 0;
    let slashX = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(4, 5, 7, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Sword Forge Phase: particles assemble into the blade shape
      if (phase === 'swordForge') {
        forgeProgress = Math.min(forgeProgress + 0.025, 1);

        particles.forEach((p) => {
          p.x += (p.targetX - p.x) * 0.08 * forgeProgress;
          p.y += (p.targetY - p.y) * 0.08 * forgeProgress;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          if (Math.random() > 0.82) {
            ctx.font = '10px monospace';
            ctx.fillText(p.char, p.x, p.y);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Glowing core blade energy line
        ctx.beginPath();
        ctx.moveTo(bladeStartX, centerY);
        ctx.lineTo(bladeStartX + bladeLength * forgeProgress, centerY);
        ctx.strokeStyle = '#ff1f43';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 24;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Powerful Slash Phase: horizontal cut across the entire screen
      if (phase === 'slash') {
        slashX += width * 0.14;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 7;
        ctx.shadowColor = '#ff1f43';
        ctx.shadowBlur = 45;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(Math.min(slashX, width), centerY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Spark fragments
        for (let j = 0; j < 14; j++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ff1f43' : '#00f0ff';
          ctx.fillRect(
            slashX + (Math.random() - 0.5) * 120,
            centerY + (Math.random() - 0.5) * 80,
            3,
            3
          );
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#040507] text-white select-none overflow-hidden transition-opacity duration-700 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top HUD Controls */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between text-xs font-mono tracking-wider text-white/50">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
          <span>
            {phase === 'heartbeat'
              ? 'INITIALIZING SYSTEM // DIGITAL HEARTBEAT'
              : phase === 'redline'
              ? 'CALIBRATING CORE // ZERO VECTOR'
              : phase === 'swordForge'
              ? 'FORGING THE ROOT BLADE'
              : phase === 'slash'
              ? 'EXECUTING HORIZONTAL SLASH'
              : phase === 'domains'
              ? 'REVEALING FOUR DOMAINS'
              : '0 / 1 CONVERGENCE'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1 border border-white/20 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />}
            <span>{isMuted ? '[ SOUND OFF ]' : '[ SOUND ON ]'}</span>
          </button>
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-cyber-red/20 border border-cyber-red/50 text-cyber-red hover:bg-cyber-red hover:text-white transition-all tracking-widest font-bold"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SKIP INTRO [ESC]</span>
          </button>
        </div>
      </div>

      {/* 1. Digital Heartbeat / Boot Visualizer */}
      {phase === 'heartbeat' && (
        <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
          <div className="w-56 h-14 flex items-center justify-center">
            <svg className="w-full h-full text-cyber-red" viewBox="0 0 200 40">
              <path
                d="M 0 20 L 55 20 L 70 5 L 85 35 L 100 8 L 115 28 L 125 20 L 200 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_12px_#ff1f43]"
              />
            </svg>
          </div>
          <div className="font-mono text-xs tracking-widest text-cyber-red uppercase">
            [ PULSE DETECTED // SEEDING ZERO ]
          </div>
        </div>
      )}

      {/* 2. Thin Red Line Formation */}
      {phase === 'redline' && (
        <div className="relative z-10 w-full flex flex-col items-center animate-in fade-in duration-300">
          <div
            className="h-[2px] bg-cyber-red shadow-[0_0_25px_#ff1f43] transition-all duration-700"
            style={{ width: '65vw' }}
          />
          <div className="mt-4 font-mono text-[10px] tracking-[0.35em] text-cyber-red/70 uppercase">
            ESTABLISHING ENERGY AXIS
          </div>
        </div>
      )}

      {/* 3. Sword Forging Status */}
      {phase === 'swordForge' && (
        <div className="relative z-10 text-center pointer-events-none">
          <div className="font-mono text-xs tracking-[0.4em] text-cyber-red uppercase animate-pulse font-bold">
            FORGING ROOT BLADE FROM CODE & PARTICLES
          </div>
          <div className="mt-2 font-mono text-[10px] text-white/50 tracking-wider">
            01000110 01001001 01001100 01010100 01000101 01010010 // ROOT_SWORD_INIT
          </div>
        </div>
      )}

      {/* 4. Powerful Slash Screen Flare */}
      {phase === 'slash' && (
        <div className="fixed inset-0 z-20 pointer-events-none bg-white/30 animate-slash" />
      )}

      {/* 5. Four Domains Reveal Sequence Behind Slash */}
      {phase === 'domains' && (
        <div className="relative z-10 max-w-4xl px-6 w-full flex flex-col items-center">
          <div className="font-mono text-xs text-cyber-cyan tracking-[0.35em] uppercase mb-8 font-bold">
            TRANSCENDING REALMS // THE FOUR DOMAINS
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
            {/* AI */}
            <div
              className={`p-5 rounded-lg border transition-all duration-500 flex flex-col items-center text-center ${
                domainStep >= 0
                  ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-100 opacity-100'
                  : 'border-white/10 opacity-20 scale-95'
              }`}
            >
              <div className="font-mono text-xs text-cyber-cyan mb-2 font-bold">[ 01 ]</div>
              <div className="font-display font-black text-2xl md:text-3xl text-white tracking-widest">
                AI
              </div>
              <div className="mt-2 text-xs font-mono text-cyber-cyan/90 uppercase">
                NEURAL INTELLIGENCE
              </div>
              <div className="mt-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
              </div>
            </div>

            {/* CYBER */}
            <div
              className={`p-5 rounded-lg border transition-all duration-500 flex flex-col items-center text-center ${
                domainStep >= 1
                  ? 'border-cyber-red bg-cyber-red/15 shadow-[0_0_30px_rgba(255,31,67,0.3)] scale-100 opacity-100'
                  : 'border-white/10 opacity-20 scale-95'
              }`}
            >
              <div className="font-mono text-xs text-cyber-red mb-2 font-bold">[ 02 ]</div>
              <div className="font-display font-black text-2xl md:text-3xl text-white tracking-widest">
                CYBER
              </div>
              <div className="mt-2 text-xs font-mono text-cyber-red/90 uppercase">
                ATTACK & DEFENSE
              </div>
              <div className="mt-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-red" />
              </div>
            </div>

            {/* CLOUD */}
            <div
              className={`p-5 rounded-lg border transition-all duration-500 flex flex-col items-center text-center ${
                domainStep >= 2
                  ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_30px_rgba(0,240,255,0.3)] scale-100 opacity-100'
                  : 'border-white/10 opacity-20 scale-95'
              }`}
            >
              <div className="font-mono text-xs text-cyber-cyan mb-2 font-bold">[ 03 ]</div>
              <div className="font-display font-black text-2xl md:text-3xl text-white tracking-widest">
                CLOUD
              </div>
              <div className="mt-2 text-xs font-mono text-cyber-cyan/90 uppercase">
                GLOBAL INFRASTRUCTURE
              </div>
              <div className="mt-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
              </div>
            </div>

            {/* ENTREPRENEURSHIP */}
            <div
              className={`p-5 rounded-lg border transition-all duration-500 flex flex-col items-center text-center ${
                domainStep >= 3
                  ? 'border-brand-green bg-brand-green/15 shadow-[0_0_30px_rgba(0,230,118,0.3)] scale-100 opacity-100'
                  : 'border-white/10 opacity-20 scale-95'
              }`}
            >
              <div className="font-mono text-xs text-brand-green mb-2 font-bold">[ 04 ]</div>
              <div className="font-display font-black text-lg md:text-xl text-white tracking-wider">
                ENTREPRENEUR
              </div>
              <div className="mt-2 text-xs font-mono text-brand-green/90 uppercase">
                IMPACT & SCALE
              </div>
              <div className="mt-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Merge into 0 / 1 */}
      {phase === 'merge' && (
        <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in-50 duration-500">
          <div className="flex items-center gap-8 sm:gap-14">
            <span className="font-display font-black text-8xl sm:text-9xl text-cyber-red filter drop-shadow-[0_0_40px_#ff1f43]">
              0
            </span>
            <span className="font-mono text-6xl sm:text-8xl text-white/30">/</span>
            <span className="font-display font-black text-8xl sm:text-9xl text-cyber-cyan filter drop-shadow-[0_0_40px_#00f0ff]">
              1
            </span>
          </div>
          <div className="mt-6 font-mono text-xs tracking-[0.5em] text-white/80 uppercase font-bold">
            CONVERGENCE ACHIEVED
          </div>
        </div>
      )}

      {/* 7. Title & Hero Quote reveal */}
      {(phase === 'titles' || phase === 'fadeout') && (
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-block px-3 py-1 mb-4 border border-white/20 bg-white/5 font-mono text-xs tracking-[0.3em] text-white/70 uppercase font-bold">
            0 / 1
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter text-white leading-none uppercase">
            FILTERING ZEROES:
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan">
              ROOTIFYING
            </span>
          </h1>
          <div className="my-6 w-24 h-[1px] bg-gradient-to-r from-cyber-red to-cyber-cyan" />
          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white/90 tracking-wide">
            “Born in the 0. Resurrected in the 1.”
          </p>
          <div className="mt-6 font-mono text-xs tracking-[0.35em] text-white/60 uppercase">
            AI × CYBERSECURITY × CLOUD × ENTREPRENEURSHIP
          </div>
        </div>
      )}
    </div>
  );
};
