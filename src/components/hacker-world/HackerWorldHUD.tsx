import React, { useState, useEffect, useCallback } from 'react';
import type { WorldNodeData } from './NetworkNodes';
import { sound } from '../../utils/audio';
import {
  Terminal,
  Activity,
  ArrowRight,
  ExternalLink,
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface HackerWorldHUDProps {
  isBooting: boolean;
  onEnterWorld: () => void;
  onSkipToRegistration: () => void;
  nearbyNode: WorldNodeData | null;
  onInteractNode: (node: WorldNodeData) => void;
  discoveredCount: number;
  totalNodes: number;
  playerCoords: { x: number; z: number };
  boundaryAlert?: boolean;
  onVirtualMove?: (dir: { x: number; z: number }) => void;
  onVirtualMoveEnd?: () => void;
}

export const HackerWorldHUD: React.FC<HackerWorldHUDProps> = ({
  isBooting,
  onEnterWorld,
  onSkipToRegistration,
  nearbyNode,
  onInteractNode,
  discoveredCount,
  totalNodes,
  playerCoords,
  boundaryAlert = false,
  onVirtualMove,
  onVirtualMoveEnd,
}) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [activeModalNode, setActiveModalNode] = useState<WorldNodeData | null>(null);

  // 5-Step Hacking / Authentication Flow State
  const [authStep, setAuthStep] = useState<number>(1);
  const [authProgress, setAuthProgress] = useState<number>(0);
  const [hexScramble, setHexScramble] = useState<string>('0x7F2A...A1');
  const [showControlsTutorial, setShowControlsTutorial] = useState<boolean>(true);

  // Boot sequence timer
  useEffect(() => {
    if (!isBooting) return;
    const t1 = setTimeout(() => setBootStep(1), 250);
    const t2 = setTimeout(() => setBootStep(2), 850);
    const t3 = setTimeout(() => setBootStep(3), 1450);
    const t4 = setTimeout(() => setBootStep(4), 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isBooting]);

  // Handle open modal & start 5-step authentication sequence
  const startAuthentication = useCallback((node: WorldNodeData) => {
    setActiveModalNode(node);
    setShowControlsTutorial(false);
    setAuthStep(1);
    setAuthProgress(0);
    sound.playNodeDetected();

    // Trigger character interaction animation
    onInteractNode(node);

    // Step 2: Scanning & Decrypting Cipher (after 450ms)
    const tScan = setTimeout(() => {
      setAuthStep(2);
      sound.playNodeScanning();
    }, 450);

    return () => clearTimeout(tScan);
  }, [onInteractNode]);

  // Progress animation for Step 2
  useEffect(() => {
    if (!activeModalNode || authStep !== 2) return;

    const interval = setInterval(() => {
      setAuthProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Advance to Step 3: Verified
          setAuthStep(3);
          sound.playAccessVerified();

          // Advance to Step 4: Connection Established (after 350ms)
          setTimeout(() => {
            setAuthStep(4);
            sound.playConnectionEstablished();

            // Advance to Step 5: Access Granted (after 400ms)
            setTimeout(() => {
              setAuthStep(5);
              sound.playAccessGranted();
            }, 400);
          }, 350);

          return 100;
        }
        // Scramble hex code
        const hex = '0x' + Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase();
        setHexScramble(hex);
        return prev + 12;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [activeModalNode, authStep]);

  // Bypass cipher directly to step 5
  const bypassCipher = () => {
    sound.playAccessGranted();
    setAuthProgress(100);
    setAuthStep(5);
  };

  // Keyboard shortcut [E] or Space to interact with nearby node
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isBooting) {
        if (e.key === ' ' || e.key === 'Enter') {
          onEnterWorld();
        }
        return;
      }

      if ((e.key === 'e' || e.key === 'E') && nearbyNode && !activeModalNode) {
        e.preventDefault();
        startAuthentication(nearbyNode);
      }

      if (e.key === 'Escape' && activeModalNode) {
        setActiveModalNode(null);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isBooting, nearbyNode, activeModalNode, onEnterWorld, startAuthentication]);

  const progressPercent = Math.min(
    100,
    Math.round((discoveredCount / Math.max(1, totalNodes)) * 100)
  );

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 overflow-hidden font-mono text-white">
      {/* =========================================================
          1. CINEMATIC BOOT SCREEN WITH DUAL-PATH OPTIONS
          ========================================================= */}
      {isBooting && (
        <div className="absolute inset-0 bg-[#040507] flex flex-col items-center justify-center p-6 text-center pointer-events-auto z-50">
          <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />

          {/* Quick Skip Button in Top-Right */}
          <button
            onClick={() => {
              sound.playButtonConfirm();
              onEnterWorld();
            }}
            className="absolute top-6 right-6 px-3 py-1.5 rounded border border-white/20 hover:border-cyber-cyan bg-black/60 text-white/60 hover:text-cyber-cyan text-xs font-mono transition-colors cursor-pointer"
          >
            [ SKIP INTRO &rarr; ]
          </button>

          <div className="max-w-lg w-full space-y-4 text-xs sm:text-sm text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-cyber-cyan/30 text-cyber-cyan">
              <Terminal className="w-4 h-4 animate-pulse text-cyber-red" />
              <span>TERMINAL ROOT INITIALIZATION // 2026</span>
            </div>

            {bootStep >= 1 && (
              <p className="text-white/80 animate-in fade-in duration-200">
                &gt; SYSTEM INITIALIZING...
              </p>
            )}
            {bootStep >= 2 && (
              <p className="text-cyber-cyan animate-in fade-in duration-200">
                &gt; NETWORK DETECTED: 0x00 &harr; 0x01
              </p>
            )}
            {bootStep >= 3 && (
              <p className="text-brand-green animate-in fade-in duration-200">
                &gt; USER CONNECTION ESTABLISHED: PROXY ACTIVE
              </p>
            )}

            {bootStep >= 4 && (
              <div className="pt-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-400">
                <div className="text-3xl sm:text-4xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyber-red via-white to-cyber-cyan uppercase mb-2">
                  ACCESS THE ROOT.
                </div>
                <p className="font-serif italic text-white/70 text-sm mb-6">
                  “Born in the 0. Resurrected in the 1.”
                </p>

                {/* Dual-Path Choice */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                  <button
                    onClick={() => {
                      sound.playButtonConfirm();
                      onEnterWorld();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-cyber-cyan bg-cyber-cyan/15 hover:bg-cyber-cyan text-white hover:text-black font-bold tracking-widest uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 flex items-center justify-center gap-2.5 cursor-pointer text-xs"
                    data-cursor="access"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
                    <span>EXPLORE 3D WORLD</span>
                    <span>&rarr;</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playButtonConfirm();
                      onSkipToRegistration();
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-lg border border-cyber-red/60 bg-cyber-red/10 hover:bg-cyber-red hover:text-white text-cyber-red font-bold tracking-wider uppercase transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyber-red" />
                    <span>SKIP TO REGISTRATION</span>
                  </button>
                </div>
                <span className="text-[10px] text-white/40 mt-3">
                  [ PRESS SPACE OR SELECT AN OPTION TO CONTINUE ]
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          2. TOP TELEMETRY HUD
          ========================================================= */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-start justify-between pointer-events-auto">
        {/* Top-Left: Event Title & Identity */}
        <div className="flex flex-col gap-1 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyber-red animate-ping" />
            <span className="font-display font-black tracking-wider text-white">
              FILTERING ZEROES:
            </span>
            <span className="text-cyber-cyan font-bold">ROOTIFYING</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/50">
            <span className="text-cyber-red font-bold">0</span>
            <span>/</span>
            <span className="text-cyber-cyan font-bold">1</span>
            <span>|</span>
            <span className="text-brand-green">SOVEREIGN NETWORK</span>
          </div>
        </div>

        {/* Top-Right: Network Discovery Progress */}
        <div className="flex flex-col items-end gap-1.5 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-[10px] text-white/60">
            <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>ROOT ACCESS:</span>
            <span className="text-cyber-cyan font-bold font-mono">
              {progressPercent}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-28 sm:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyber-red via-cyber-cyan to-brand-green transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[9px] text-white/40">
            NODES DISCOVERED: {discoveredCount} / {totalNodes}
          </div>
        </div>
      </div>

      {/* =========================================================
          3. BOUNDARY DETECTION ALERT BANNER (Smooth pulse, no audio spam)
          ========================================================= */}
      {boundaryAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 border border-cyber-red/70 text-cyber-red text-xs font-mono shadow-[0_0_20px_rgba(255,31,67,0.3)]">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>BOUNDARY DETECTED // VECTOR CLAMPED</span>
          </div>
        </div>
      )}

      {/* =========================================================
          4. PROXIMITY INTERACTION BANNER (Active when near a node)
          ========================================================= */}
      {nearbyNode && !activeModalNode && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => startAuthentication(nearbyNode)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/85 border border-cyber-cyan/60 hover:border-cyber-cyan text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-105 cursor-pointer group"
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: nearbyNode.color }}
            />
            <span className="text-xs font-bold tracking-wider">
              APPROACHING: {nearbyNode.title}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] text-cyber-cyan group-hover:bg-cyber-cyan group-hover:text-black font-bold">
              [PRESS E / TAP TO ACCESS]
            </span>
          </button>
        </div>
      )}

      {/* =========================================================
          5. FIRST-TIME CONTROLS TUTORIAL CARD (Auto-fades)
          ========================================================= */}
      {showControlsTutorial && !isBooting && !activeModalNode && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/80 border border-white/20 text-xs backdrop-blur-md shadow-2xl">
            <span className="text-cyber-cyan font-bold">CONTROLS:</span>
            <span className="text-white/80">W A S D (Move)</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Shift (Run)</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Drag (Rotate)</span>
            <span className="text-white/40">•</span>
            <span className="text-cyber-cyan font-bold">E (Access Node)</span>
            <button
              onClick={() => setShowControlsTutorial(false)}
              className="ml-2 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          6. BOTTOM HUD & CONTROLS GUIDE
          ========================================================= */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
        {/* Controls Helper */}
        <div className="hidden md:flex items-center gap-4 p-2.5 rounded bg-black/60 border border-white/10 text-[11px] text-white/60">
          <div className="flex items-center gap-1.5 text-white/80">
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-bold">
              W A S D
            </span>
            <span>MOVE</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-white/80">
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-bold">
              SHIFT
            </span>
            <span>RUN</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-cyber-cyan">
            <span className="px-1.5 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan/40 font-bold">
              E
            </span>
            <span>ACCESS NODE</span>
          </div>
        </div>

        {/* Center Prompt to Explore Downwards */}
        <a
          href="#manifesto"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs tracking-wider transition-all"
        >
          <span>EXPLORE ECOSYSTEM</span>
          <span>&darr;</span>
        </a>

        {/* Telemetry Coords */}
        <div className="flex items-center gap-3 p-2.5 rounded bg-black/60 border border-white/10 text-[10px] text-white/40">
          <Compass className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>
            X: {playerCoords.x.toFixed(1)} // Z: {playerCoords.z.toFixed(1)}
          </span>
          <span>|</span>
          <span className="text-brand-green">WORLD: ONLINE</span>
        </div>
      </div>

      {/* =========================================================
          7. MOBILE VIRTUAL JOYSTICK CONTROLS (Phones & Tablets)
          ========================================================= */}
      <div className="md:hidden absolute bottom-20 left-6 pointer-events-auto">
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-black/80 border border-white/15">
          <div />
          <button
            onTouchStart={() => onVirtualMove && onVirtualMove({ x: 0, z: -1 })}
            onTouchEnd={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            onMouseDown={() => onVirtualMove && onVirtualMove({ x: 0, z: -1 })}
            onMouseUp={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            className="w-10 h-10 rounded bg-white/10 active:bg-cyber-cyan active:text-black flex items-center justify-center font-bold text-xs"
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={() => onVirtualMove && onVirtualMove({ x: -1, z: 0 })}
            onTouchEnd={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            onMouseDown={() => onVirtualMove && onVirtualMove({ x: -1, z: 0 })}
            onMouseUp={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            className="w-10 h-10 rounded bg-white/10 active:bg-cyber-cyan active:text-black flex items-center justify-center font-bold text-xs"
          >
            ◀
          </button>
          <button
            onTouchStart={() => onVirtualMove && onVirtualMove({ x: 0, z: 1 })}
            onTouchEnd={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            onMouseDown={() => onVirtualMove && onVirtualMove({ x: 0, z: 1 })}
            onMouseUp={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            className="w-10 h-10 rounded bg-white/10 active:bg-cyber-cyan active:text-black flex items-center justify-center font-bold text-xs"
          >
            ▼
          </button>
          <button
            onTouchStart={() => onVirtualMove && onVirtualMove({ x: 1, z: 0 })}
            onTouchEnd={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            onMouseDown={() => onVirtualMove && onVirtualMove({ x: 1, z: 0 })}
            onMouseUp={() => onVirtualMoveEnd && onVirtualMoveEnd()}
            className="w-10 h-10 rounded bg-white/10 active:bg-cyber-cyan active:text-black flex items-center justify-center font-bold text-xs"
          >
            ▶
          </button>
        </div>
      </div>

      {/* =========================================================
          8. 5-STEP HOLOGRAPHIC ACCESS / SCANLINE PANEL MODAL
          ========================================================= */}
      {activeModalNode && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#06080e] border border-cyber-cyan/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col justify-between overflow-hidden">
            {/* Scanline background overlay */}
            <div className="absolute inset-0 scanline-bg opacity-30 pointer-events-none" />

            {/* Top Close Button */}
            <button
              onClick={() => setActiveModalNode(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-black/60 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Stage Progress Bar (Step 1 -> 5) */}
            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    s < authStep
                      ? 'bg-brand-green'
                      : s === authStep
                      ? 'bg-cyber-cyan animate-pulse'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Intercepting Signal */}
            {authStep === 1 && (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <span className="w-12 h-12 rounded-full border-2 border-cyber-cyan flex items-center justify-center animate-spin">
                  <Terminal className="w-6 h-6 text-cyber-cyan" />
                </span>
                <span className="text-xs text-white/60">[01/05] SIGNAL DETECTED</span>
                <h4 className="text-xl font-display font-black text-white tracking-wider">
                  INTERCEPTING {activeModalNode.code}
                </h4>
              </div>
            )}

            {/* Step 2: Decrypting Cipher */}
            {authStep === 2 && (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <div className="text-3xl font-mono font-black text-cyber-cyan animate-pulse">
                  {hexScramble}
                </div>
                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-cyan transition-all"
                    style={{ width: `${authProgress}%` }}
                  />
                </div>
                <span className="text-xs text-white/60">
                  [02/05] DECRYPTING CIPHER... {authProgress}%
                </span>
                <button
                  onClick={bypassCipher}
                  className="text-[10px] text-cyber-cyan/70 hover:text-cyber-cyan underline pt-2 cursor-pointer"
                >
                  [ BYPASS CIPHER / INSTANT ACCESS ]
                </button>
              </div>
            )}

            {/* Step 3: Verified */}
            {authStep === 3 && (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-brand-green animate-bounce" />
                <span className="text-xs text-brand-green font-bold">
                  [03/05] CLEARANCE VERIFIED
                </span>
                <h4 className="text-xl font-display font-black text-white tracking-wider">
                  SECURITY RING 0 GRANTED
                </h4>
              </div>
            )}

            {/* Step 4: Connection Established */}
            {authStep === 4 && (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <Zap className="w-12 h-12 text-cyber-cyan animate-ping" />
                <span className="text-xs text-cyber-cyan font-bold">
                  [04/05] PROTOCOL ESTABLISHED
                </span>
                <h4 className="text-xl font-display font-black text-white tracking-wider">
                  STREAMING TELEMETRY DOSSIER...
                </h4>
              </div>
            )}

            {/* Step 5: Full Holographic Dossier Panel */}
            {authStep === 5 && (
              <div className="animate-in fade-in duration-300">
                {/* Header Telemetry */}
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10 text-xs">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: activeModalNode.color }}
                  />
                  <span className="text-white/50">{activeModalNode.code}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-brand-green font-bold">
                    [05/05] STATUS: {activeModalNode.status}
                  </span>
                </div>

                {/* Community or Gate Image if present */}
                {activeModalNode.partnerImage && (
                  <div className="my-3 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-xl bg-black/80 border border-cyber-cyan/40 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                      <img
                        src={activeModalNode.partnerImage}
                        alt={activeModalNode.title}
                        className="w-full h-full object-contain filter contrast-105"
                      />
                    </div>
                  </div>
                )}

                {/* Title & SubLabel */}
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider uppercase mb-1">
                  {activeModalNode.title}
                </h3>
                {activeModalNode.subLabel && (
                  <div className="text-[11px] font-mono text-cyber-cyan tracking-widest uppercase mb-3">
                    {activeModalNode.subLabel}
                  </div>
                )}

                {/* Description */}
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans my-3">
                  {activeModalNode.description}
                </p>

                {activeModalNode.details && (
                  <div className="p-3.5 rounded bg-black/60 border border-white/10 text-xs text-white/70 font-mono mb-6">
                    <span className="text-cyber-red font-bold">&gt;&gt; DIRECTIVE: </span>
                    {activeModalNode.details}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      sound.playButtonConfirm();
                      sound.playNavWhoosh();
                      const targetAnchor = activeModalNode.targetAnchor || '#manifesto';
                      const targetTitle = activeModalNode.title;
                      setActiveModalNode(null);

                      const el = document.querySelector(targetAnchor);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }

                      // Dispatch 8-second auto-return telemetry event
                      window.dispatchEvent(
                        new CustomEvent('fz:telemetry-inspect', {
                          detail: {
                            targetAnchor,
                            title: targetTitle,
                          },
                        })
                      );
                    }}
                    className="px-6 py-2.5 rounded-lg bg-cyber-cyan text-black font-black text-xs tracking-widest uppercase hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  >
                    <span>
                      {activeModalNode.category === 'gate'
                        ? 'ENTER ROOTIFY ACCESS'
                        : 'ACCESS TELEMETRY'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {activeModalNode.category === 'community' && (
                    <a
                      href="https://docs.google.com/forms/d/1lDHES3lIdxrCKSNH2Ue-k2s26zMMcTSl4P0aloMZp80/edit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-lg border border-white/20 bg-black/60 hover:border-cyber-cyan text-white text-xs font-bold tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <span>JOIN NETWORK</span>
                      <ExternalLink className="w-3 h-3 text-cyber-cyan" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
