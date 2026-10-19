import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DragonSerpentineJourneyProps {
  onClose: () => void;
}

interface CheckpointNode {
  id: number;
  label: string;
  name: string;
  statusLabel: string;
  isUnlocked: boolean;
  coords: { x: number; y: number }; // In 1024x682 coordinate space
  cardPos: { left: string; top: string; width: string };
  link?: string;
  description?: string;
}

// Checkpoint data positioned along the serpentine dragon's path
const CHECKPOINTS: CheckpointNode[] = [
  {
    id: 1,
    label: '01',
    name: 'THE SIGNAL',
    statusLabel: 'OPEN NOW',
    isUnlocked: true,
    coords: { x: 274, y: 194 },
    cardPos: { left: '5.8%', top: '30.5%', width: '21.5%' },
    link: 'https://unstop.com/o/812FQZe?lb=AOfe9oit&utm_medium=Share&utm_source=prabhjot2265&utm_campaign=Workshops',
    description: 'Your journey begins here. Step into the first signal and build your edge.',
  },
  {
    id: 2,
    label: '02',
    name: 'CHECKPOINT 02',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 562, y: 108 },
    cardPos: { left: '53.0%', top: '9.0%', width: '13.5%' },
  },
  {
    id: 3,
    label: '03',
    name: 'CHECKPOINT 03',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 872, y: 202 },
    cardPos: { left: '83.0%', top: '22.0%', width: '13.5%' },
  },
  {
    id: 4,
    label: '04',
    name: 'CHECKPOINT 04',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 586, y: 254 },
    cardPos: { left: '55.0%', top: '29.5%', width: '13.5%' },
  },
  {
    id: 5,
    label: '05',
    name: 'CHECKPOINT 05',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 394, y: 354 },
    cardPos: { left: '36.5%', top: '44.5%', width: '13.5%' },
  },
  {
    id: 6,
    label: '06',
    name: 'CHECKPOINT 06',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 855, y: 380 },
    cardPos: { left: '81.5%', top: '48.5%', width: '13.5%' },
  },
  {
    id: 7,
    label: '07',
    name: 'CHECKPOINT 07',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 463, y: 482 },
    cardPos: { left: '43.5%', top: '63.5%', width: '13.5%' },
  },
  {
    id: 8,
    label: '08',
    name: 'CHECKPOINT 08',
    statusLabel: 'REVEALING SOON',
    isUnlocked: false,
    coords: { x: 770, y: 538 },
    cardPos: { left: '73.0%', top: '70.0%', width: '13.5%' },
  },
];

// Continuous 38-point serpentine spine trajectory from Head through all checkpoints to Tail
const DRAGON_SPINE_POINTS = [
  { x: 340, y: 70 },
  { x: 380, y: 95 },
  { x: 410, y: 112 }, // Eye
  { x: 438, y: 158 }, // Mouth
  { x: 370, y: 185 },
  { x: 274, y: 194 }, // CP 01
  { x: 330, y: 205 },
  { x: 430, y: 175 },
  { x: 510, y: 130 },
  { x: 562, y: 108 }, // CP 02
  { x: 650, y: 115 },
  { x: 740, y: 140 },
  { x: 815, y: 175 },
  { x: 872, y: 202 }, // CP 03
  { x: 850, y: 235 },
  { x: 760, y: 248 },
  { x: 670, y: 252 },
  { x: 586, y: 254 }, // CP 04
  { x: 500, y: 275 },
  { x: 440, y: 310 },
  { x: 394, y: 354 }, // CP 05
  { x: 450, y: 370 },
  { x: 560, y: 375 },
  { x: 680, y: 372 },
  { x: 780, y: 375 },
  { x: 855, y: 380 }, // CP 06
  { x: 885, y: 420 },
  { x: 850, y: 460 },
  { x: 750, y: 480 },
  { x: 600, y: 485 },
  { x: 463, y: 482 }, // CP 07
  { x: 530, y: 498 },
  { x: 630, y: 525 },
  { x: 710, y: 538 },
  { x: 770, y: 538 }, // CP 08
  { x: 840, y: 545 },
  { x: 905, y: 520 },
  { x: 945, y: 460 },
  { x: 955, y: 390 }, // Tail tip
];

type DragonMood = 'idle' | 'roaring' | 'celebrating';

export const DragonSerpentineJourney: React.FC<DragonSerpentineJourneyProps> = ({
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragonMood, setDragonMood] = useState<DragonMood>('idle');
  const [dragonDialogue, setDragonDialogue] = useState<string>(
    'I AM THE CYBER-DRAKE GUARDIAN. SEEK THE UNSEALED SIGNAL.'
  );
  const [hoveredCpId, setHoveredCpId] = useState<number | null>(null);
  const [selectedCpId, setSelectedCpId] = useState<number>(1);
  const [shakingCpId, setShakingCpId] = useState<number | null>(null);
  const [lightningTarget, setLightningTarget] = useState<{ x: number; y: number } | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => sound.getIsMuted());

  const moodTimerRef = useRef<number | null>(null);
  const lightningTimerRef = useRef<number | null>(null);

  // Keyboard navigation & body lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    sound.playSystemActivation();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playHoverClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
    };
  }, [onClose]);

  // Audio mute toggle
  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsAudioMuted(next);
  };

  // Click on Checkpoint 01 (Open Signal)
  const handleOpenCheckpoint = useCallback(() => {
    setSelectedCpId(1);
    setDragonMood('celebrating');
    sound.playDragonWelcome();
    setDragonDialogue('THE FIRST SIGNAL IS OPEN. YOUR JOURNEY BEGINS NOW.');

    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    moodTimerRef.current = window.setTimeout(() => {
      setDragonMood('idle');
      setDragonDialogue('PROCEED TO UNSTOP REGISTRATION TO CLAIM YOUR PASS.');
    }, 4500);
  }, []);

  // Click on Locked Checkpoints (02–08)
  const handleLockedCheckpoint = useCallback((cp: CheckpointNode) => {
    setSelectedCpId(cp.id);
    setDragonMood('roaring');
    sound.playDragonRoar();
    setShakingCpId(cp.id);
    setLightningTarget(cp.coords);
    setDragonDialogue('THIS SIGNAL REMAINS SEALED. REVEALING SOON.');

    if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
    lightningTimerRef.current = window.setTimeout(() => {
      setLightningTarget(null);
    }, 700);

    setTimeout(() => {
      setShakingCpId(null);
    }, 550);

    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    moodTimerRef.current = window.setTimeout(() => {
      setDragonMood('idle');
      setDragonDialogue('THE ROOTIFYING PATH AWAITS. ONLY ONE FREQUENCY IS DECODED.');
    }, 3800);
  }, []);

  // Center view on mobile when clicking a quick-select node
  const handleQuickJump = (cp: CheckpointNode) => {
    if (cp.isUnlocked) {
      handleOpenCheckpoint();
    } else {
      handleLockedCheckpoint(cp);
    }

    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      const targetScroll = (cp.coords.x / 1024) * scrollWidth - clientWidth / 2;
      containerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  // =========================================================================
  // ANIMATED CANVAS LAYER: SERPENTINE ENERGY, DRAGON EYES, ROAR LIGHTNING
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Generate floating ambient cyber-embers
    const emberCount = 35;
    const embers: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * 1024,
        y: Math.random() * 682,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.2,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ff1f43',
      });
    }

    // Catmull-Rom interpolation helper for smooth curve
    const getPointAt = (pts: Array<{ x: number; y: number }>, t: number) => {
      const p = (pts.length - 1) * t;
      const intPoint = Math.floor(p);
      const weight = p - intPoint;

      const p0 = pts[Math.max(0, intPoint - 1)];
      const p1 = pts[intPoint];
      const p2 = pts[Math.min(pts.length - 1, intPoint + 1)];
      const p3 = pts[Math.min(pts.length - 1, intPoint + 2)];

      const t2 = weight * weight;
      const t3 = t2 * weight;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * weight +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * weight +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

      return { x, y };
    };

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, 1024, 682);

      // 1. Draw glowing serpentine energy flow along the spine
      const energyPulseCount = 6;
      for (let i = 0; i < energyPulseCount; i++) {
        const pulseT = (time * 0.12 + i / energyPulseCount) % 1.0;
        const pt = getPointAt(DRAGON_SPINE_POINTS, pulseT);

        const isCyan = i % 2 === 0;
        const gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 22);
        gradient.addColorStop(0, isCyan ? 'rgba(0, 240, 255, 0.9)' : 'rgba(255, 31, 67, 0.85)');
        gradient.addColorStop(0.4, isCyan ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 31, 67, 0.35)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
        ctx.fill();

        // High intensity core spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Dragon Eye Glow Animation at (410, 112)
      const eyeX = 410;
      const eyeY = 112;
      const isRoaring = dragonMood === 'roaring';
      const isCelebrating = dragonMood === 'celebrating';

      const eyeColor = isCelebrating ? '#ffd700' : '#ff1f43';
      const eyeRadius = isRoaring ? 16 + Math.sin(time * 20) * 4 : 8 + Math.sin(time * 3) * 2;

      const eyeGrad = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, eyeRadius * 2);
      eyeGrad.addColorStop(0, '#ffffff');
      eyeGrad.addColorStop(0.3, eyeColor);
      eyeGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Slit iris
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY - eyeRadius * 0.7);
      ctx.lineTo(eyeX, eyeY + eyeRadius * 0.7);
      ctx.stroke();

      // 3. Dragon Roar Lightning / Plasma Arc to clicked locked checkpoint
      if (lightningTarget) {
        const mouthX = 438;
        const mouthY = 158;
        const targetX = lightningTarget.x;
        const targetY = lightningTarget.y;

        ctx.save();
        ctx.strokeStyle = '#ff1f43';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ff1f43';
        ctx.shadowBlur = 18;

        // Jagged electric beam
        const segments = 12;
        ctx.beginPath();
        ctx.moveTo(mouthX, mouthY);

        for (let s = 1; s < segments; s++) {
          const segT = s / segments;
          const baseX = mouthX + (targetX - mouthX) * segT;
          const baseY = mouthY + (targetY - mouthY) * segT;
          const jitterX = (Math.random() - 0.5) * 16;
          const jitterY = (Math.random() - 0.5) * 16;
          ctx.lineTo(baseX + jitterX, baseY + jitterY);
        }
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // White core bolt
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Target shockwave explosion ring
        const shockRadius = 15 + (Math.sin(time * 25) + 1) * 18;
        ctx.strokeStyle = 'rgba(255, 31, 67, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(targetX, targetY, shockRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 4. Portal Ascension Vertical Laser Beam on Island 08
      const portalX = 700;
      const portalY = 530;
      const beamAlpha = 0.55 + Math.sin(time * 4) * 0.25;

      const beamGrad = ctx.createLinearGradient(portalX, portalY, portalX, portalY - 260);
      beamGrad.addColorStop(0, `rgba(255, 31, 67, ${beamAlpha})`);
      beamGrad.addColorStop(0.6, `rgba(255, 31, 67, ${beamAlpha * 0.4})`);
      beamGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(portalX - 2.5, portalY - 260, 5, 260);

      // 5. Update and render ambient floating embers
      for (const ember of embers) {
        ember.x += ember.vx;
        ember.y += ember.vy;

        if (ember.y < 0) {
          ember.y = 682;
          ember.x = Math.random() * 1024;
        }

        ctx.fillStyle = ember.color;
        ctx.globalAlpha = ember.alpha * (0.6 + Math.sin(time * 3 + ember.x) * 0.4);
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [dragonMood, lightningTarget]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-master-title"
      className="fixed inset-0 z-50 flex flex-col bg-[#010204] text-[#e2e8f0] select-none overflow-hidden"
    >
      {/* ===================================================================
          FIXED TOP COMMAND BAR: CLOSE BUTTON & AUDIO TOGGLE
          =================================================================== */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[80] flex items-center gap-3">
        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={toggleMute}
          className="h-11 px-3 sm:px-4 rounded-xl bg-black/85 hover:bg-cyber-cyan/20 border-2 border-white/20 hover:border-cyber-cyan text-white/80 hover:text-white flex items-center gap-2 shadow-[0_0_25px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-200 text-xs font-mono"
          title="Toggle Procedural Audio [M]"
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-cyber-red" />
              <span className="hidden sm:inline text-[10px] uppercase font-bold text-cyber-red">
                MUTED
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyber-cyan animate-pulse" />
              <span className="hidden sm:inline text-[10px] uppercase font-bold text-cyber-cyan">
                AUDIO ACTIVE
              </span>
            </>
          )}
        </button>

        {/* Big Prominent Fixed × Close Button */}
        <button
          onClick={() => {
            sound.playHoverClick();
            onClose();
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/85 hover:bg-cyber-red/25 border-2 border-white/20 hover:border-cyber-red text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)] hover:shadow-[0_0_30px_rgba(255,31,67,0.7)] backdrop-blur-md transition-all duration-200 group active:scale-90"
          aria-label="Close Journey and return to website"
          title="Close Journey [ESC]"
        >
          <X className="w-6 h-6 text-cyber-red group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* ===================================================================
          TOP BRANDING & LIVE GUARDIAN DIALOGUE BANNER
          =================================================================== */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 z-40 pointer-events-none max-w-sm sm:max-w-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
          <span className="font-mono text-[10px] font-black tracking-[0.25em] text-cyber-red uppercase">
            ROOTIFYING MISSION MAP
          </span>
        </div>
        <h1
          id="journey-master-title"
          className="font-display font-black text-lg sm:text-2xl text-white tracking-wider uppercase text-glow-cyan"
        >
          FILTERING ZEROES
        </h1>
        <div className="font-mono text-[9px] sm:text-[10px] text-white/60 tracking-widest uppercase">
          BORN IN THE 0. RESURRECTED IN THE 1.
        </div>
      </div>

      {/* Floating Center Dragon Dialogue Banner */}
      <div className="absolute top-14 sm:top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-lg w-[90%] sm:w-auto px-4 text-center">
        <div
          className={`px-4 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 font-mono shadow-2xl ${
            dragonMood === 'roaring'
              ? 'border-cyber-red bg-[#16060a]/95 text-cyber-red shadow-[0_0_25px_rgba(255,31,67,0.5)] animate-card-shake'
              : dragonMood === 'celebrating'
              ? 'border-amber-400 bg-[#161204]/95 text-amber-300 shadow-[0_0_25px_rgba(250,204,21,0.5)]'
              : 'border-cyber-cyan/40 bg-[#040813]/90 text-white/90 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
          }`}
        >
          <div
            className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] mb-0.5 ${
              dragonMood === 'roaring'
                ? 'text-cyber-red'
                : dragonMood === 'celebrating'
                ? 'text-amber-400'
                : 'text-cyber-cyan'
            }`}
          >
            {dragonMood === 'roaring' && '⚠ GUARDIAN ROAR // ACCESS SEALED'}
            {dragonMood === 'celebrating' && '✦ GUARDIAN APPROVAL // SIGNAL VERIFIED'}
            {dragonMood === 'idle' && '◆ GUARDIAN TELEMETRY // ACTIVE SENTINEL'}
          </div>
          <div className="text-[11px] sm:text-xs font-bold tracking-wide">
            "{dragonDialogue}"
          </div>
        </div>
      </div>

      {/* Top Right Milestones Card (from reference image) */}
      <div className="hidden lg:block absolute top-16 right-6 z-30 pointer-events-none p-3.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm font-mono text-right">
        <div className="text-[11px] font-black text-white tracking-widest uppercase">
          6+ MILESTONES
        </div>
        <div className="text-[9px] text-white/50 space-y-0.5 mt-1">
          <div>WORKSHOPS</div>
          <div>ROUND TABLE</div>
          <div>CTF</div>
          <div>HACKATHON</div>
          <div>ROOTIFY FINALE</div>
          <div>AND MORE...</div>
        </div>
      </div>

      {/* ===================================================================
          PANORAMIC CINEMATIC VIEWPORT (DRAGON PATH & CHECKPOINTS)
          =================================================================== */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-x-auto overflow-y-hidden custom-scrollbar bg-black"
      >
        {/* Aspect Ratio Container (1024 x 682, approx 1.50:1) */}
        <div className="relative min-w-[900px] w-full max-w-[calc(96vh*1.5)] aspect-[1024/682] max-h-[96vh] mx-auto select-none">
          {/* Base Artwork Image */}
          <img
            src="/assets/dragon-serpentine-journey.jpg"
            alt="FILTERING ZEROES ROOTIFYING Cyber-Dragon Serpentine Journey Map"
            className="w-full h-full object-contain pointer-events-none select-none block"
            draggable={false}
          />

          {/* Animated Canvas Overlay (Dragon energy, roaring lightning, eye flares, mist) */}
          <canvas
            ref={canvasRef}
            width={1024}
            height={682}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* Interactive Checkpoint Rings & Spline SVG */}
          <svg
            viewBox="0 0 1024 682"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          >
            {/* Illuminated Spline Segment on Hover */}
            {hoveredCpId !== null && (
              <polyline
                points={DRAGON_SPINE_POINTS.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 12"
                className="animate-pulse"
                filter="drop-shadow(0 0 8px #00f0ff)"
              />
            )}

            {/* Glowing Rings directly over each checkpoint node on the dragon route */}
            {CHECKPOINTS.map((cp) => {
              const isSelected = selectedCpId === cp.id;
              const isHovered = hoveredCpId === cp.id;

              return (
                <g key={cp.id}>
                  {/* Concentric Pulse Ring */}
                  <circle
                    cx={cp.coords.x}
                    cy={cp.coords.y}
                    r={cp.isUnlocked ? 16 : 13}
                    fill="none"
                    stroke={cp.isUnlocked ? '#00f0ff' : '#ff1f43'}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                    opacity={isSelected || isHovered ? 1 : 0.65}
                    className={cp.isUnlocked ? 'animate-ping' : ''}
                    style={{ transformOrigin: `${cp.coords.x}px ${cp.coords.y}px` }}
                  />

                  {/* Core Node Marker */}
                  <circle
                    cx={cp.coords.x}
                    cy={cp.coords.y}
                    r={cp.isUnlocked ? 8 : 6}
                    fill={cp.isUnlocked ? '#00f0ff' : '#1a0509'}
                    stroke={cp.isUnlocked ? '#ffffff' : '#ff1f43'}
                    strokeWidth="2"
                    filter={`drop-shadow(0 0 6px ${cp.isUnlocked ? '#00f0ff' : '#ff1f43'})`}
                  />
                </g>
              );
            })}
          </svg>

          {/* ===============================================================
              CHECKPOINT 01 INTERACTIVE PANEL: PHASE 01 — THE SIGNAL
              =============================================================== */}
          <div
            style={{
              left: CHECKPOINTS[0].cardPos.left,
              top: CHECKPOINTS[0].cardPos.top,
              width: CHECKPOINTS[0].cardPos.width,
            }}
            onClick={handleOpenCheckpoint}
            onMouseEnter={() => {
              setHoveredCpId(1);
              sound.playHoverClick();
            }}
            onMouseLeave={() => setHoveredCpId(null)}
            className="absolute z-30 p-3 sm:p-4 rounded-xl bg-[#030612]/92 border-2 border-cyber-cyan shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] backdrop-blur-md transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
            title="Checkpoint 01 — Click to inspect and register"
          >
            {/* Card Header Telemetry */}
            <div className="flex items-center justify-between gap-1 pb-1.5 mb-2 border-b border-cyber-cyan/30 text-[9px] sm:text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-cyber-red text-white font-black tracking-wider">
                01
              </span>
              <span className="font-mono font-bold text-cyber-cyan tracking-widest uppercase">
                PHASE 01
              </span>
              <span className="px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[9px] font-black bg-brand-green/20 text-brand-green border border-brand-green/50 flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                OPEN NOW
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-black text-xs sm:text-base text-white tracking-wide uppercase text-glow-cyan leading-tight">
              THE SIGNAL
            </h3>

            {/* Story */}
            <p className="mt-1 font-mono text-[9px] sm:text-[11px] text-white/80 leading-snug line-clamp-3">
              Your journey begins here. Step into the first signal and build your edge.
            </p>

            {/* Action Button: REGISTER FREE */}
            <a
              href={CHECKPOINTS[0].link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                sound.playAccessGranted();
              }}
              className="mt-2.5 w-full py-2 px-2.5 sm:px-3 rounded-lg font-mono font-black text-[10px] sm:text-xs tracking-widest uppercase bg-gradient-to-r from-cyber-cyan via-white to-cyber-cyan text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(0,240,255,0.6)] flex items-center justify-center gap-1.5 transition-all select-none cursor-pointer"
            >
              <span>REGISTER FREE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="mt-1 text-center font-mono text-[8px] text-white/40 flex items-center justify-center gap-1">
              <span>HOSTED ON UNSTOP</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* ===============================================================
              CHECKPOINTS 02 TO 08: LOCKED CYBER-PANELS
              =============================================================== */}
          {CHECKPOINTS.slice(1).map((cp) => {
            const isShaking = shakingCpId === cp.id;
            const isHovered = hoveredCpId === cp.id;

            return (
              <div
                key={cp.id}
                style={{
                  left: cp.cardPos.left,
                  top: cp.cardPos.top,
                  width: cp.cardPos.width,
                }}
                onClick={() => handleLockedCheckpoint(cp)}
                onMouseEnter={() => {
                  setHoveredCpId(cp.id);
                  sound.playHoverClick();
                }}
                onMouseLeave={() => setHoveredCpId(null)}
                className={`absolute z-30 p-2 sm:p-2.5 rounded-lg bg-[#04060e]/85 border transition-all duration-300 cursor-pointer backdrop-blur-sm group ${
                  isHovered
                    ? 'border-cyber-red/80 shadow-[0_0_20px_rgba(255,31,67,0.4)] bg-[#120509]/90 scale-105'
                    : 'border-white/15 hover:border-cyber-red/50'
                } ${isShaking ? 'animate-card-shake' : ''}`}
                title="Checkpoint locked — Click to test cipher"
              >
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-white/60 mb-1">
                  <div className="flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-cyber-red" />
                    <span className="font-bold text-white">{cp.label}</span>
                  </div>
                  <span className="text-[7px] text-white/40">CIPHER</span>
                </div>

                <div className="text-[7.5px] sm:text-[9px] font-mono text-white/50 uppercase tracking-tight leading-tight">
                  SIGNAL DETECTED
                </div>
                <div className="text-[8px] sm:text-[10px] font-mono font-bold text-cyber-red/90 uppercase tracking-tight mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse" />
                  <span>REVEALING SOON</span>
                </div>
              </div>
            );
          })}

          {/* Bottom Left Domain Box (from reference image) */}
          <div className="hidden md:block absolute bottom-4 left-4 z-30 pointer-events-none p-3 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm font-mono text-[9px] text-white/50 max-w-xs">
            <div className="font-bold text-white tracking-wider">A JOURNEY BEYOND FOUR DOMAINS</div>
            <div className="text-cyber-cyan text-[8px] mt-0.5">
              AI • CYBERSECURITY • CLOUD • WEB3 • ENTREPRENEURSHIP & BEYOND
            </div>
          </div>

          {/* Bottom Right Slogan (from reference image) */}
          <div className="hidden md:block absolute bottom-4 right-4 z-30 pointer-events-none font-mono text-[9px] text-white/40 text-right">
            <div>DIFFERENT SIGNALS.</div>
            <div className="text-white/70 font-bold">ONE BIGGER JOURNEY.</div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          MOBILE NAVIGATION DOCK: HORIZONTAL SCROLL & QUICK JUMP
          =================================================================== */}
      <div className="lg:hidden shrink-0 py-2.5 px-3 bg-[#03050a]/95 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto z-40">
        <span className="font-mono text-[9px] text-cyber-cyan font-bold tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyber-cyan animate-spin" />
          ROUTE:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {CHECKPOINTS.map((cp) => (
            <button
              key={cp.id}
              onClick={() => handleQuickJump(cp)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase whitespace-nowrap transition-all ${
                selectedCpId === cp.id
                  ? cp.isUnlocked
                    ? 'bg-cyber-cyan text-black shadow-[0_0_12px_rgba(0,240,255,0.8)]'
                    : 'bg-cyber-red text-white shadow-[0_0_12px_rgba(255,31,67,0.8)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {cp.isUnlocked ? '01: OPEN' : cp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shake & Breath Animations */}
      <style>{`
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
