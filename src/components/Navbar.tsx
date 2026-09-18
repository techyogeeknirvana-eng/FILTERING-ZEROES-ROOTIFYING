import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Terminal, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  onReplayIntro: () => void;
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro, onOpenTerminal }) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'WHY ZERO?', href: '#manifesto' },
    { label: 'ACCESS', href: '#access' },
    { label: 'FOUR WORLDS', href: '#domains' },
    { label: 'WHY ROOTIFY', href: '#why-rootify' },
    { label: 'JOURNEY', href: '#experience' },
    { label: 'ROOTIFY FINALE', href: '#rootify' },
    { label: 'TIMELINE', href: '#timeline' },
    { label: 'COMMAND HUB', href: '#command-center' },
    { label: 'PARTNERS', href: '#partner' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#040507]/92 backdrop-blur-md border-b border-cyber-border/70 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Identity */}
        <a
          href="#"
          className="group flex items-center gap-3.5 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
          data-cursor="explore"
          onClick={() => sound.playHoverClick()}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded border border-cyber-border bg-cyber-panel/80 group-hover:border-cyber-red transition-colors overflow-hidden relative">
            <img
              src="/assets/skull/skull_awakening.jpg"
              alt="Root Guardian"
              className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-extrabold tracking-wider text-white group-hover:text-cyber-cyan transition-colors">
              FILTERING ZEROES
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/50">
              ROOTIFYING // 0 / 1
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[11px] font-mono tracking-wider text-white/70">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-cyber-cyan transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyber-cyan hover:after:w-full after:transition-all"
              data-cursor="access"
              onClick={() => sound.playHoverClick()}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Control Actions & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle with [SOUND ON] / [SOUND OFF] */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border rounded transition-all ${
              isMuted
                ? 'border-cyber-border bg-cyber-panel/60 text-white/60 hover:text-white hover:border-white/30'
                : 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]'
            }`}
            title={isMuted ? 'Activate Atmospheric Sound' : 'Mute Sound'}
            data-cursor="access"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            )}
            <span className="font-bold text-[10px] tracking-wider">
              {isMuted ? '[ SOUND OFF ]' : '[ SOUND ON ]'}
            </span>
          </button>

          {/* CLI Terminal Trigger */}
          <button
            onClick={() => {
              sound.playTerminalKeystroke();
              onOpenTerminal();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono border border-cyber-border bg-cyber-panel/60 text-white/70 hover:text-cyber-cyan hover:border-cyber-cyan transition-colors rounded"
            title="Open Interactive Cyber Terminal [~]"
            data-cursor="access"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="hidden md:inline">CLI</span>
          </button>

          {/* Replay Cinematic Intro */}
          <button
            onClick={() => {
              sound.playButtonConfirm();
              onReplayIntro();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono border border-cyber-border bg-cyber-panel/60 text-white/70 hover:text-cyber-red hover:border-cyber-red transition-colors rounded"
            title="Replay Cinematic Skull Intro"
            data-cursor="access"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">REPLAY INTRO</span>
          </button>

          {/* Register / Access CTA */}
          <a
            href="#access"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black tracking-wider text-cyber-cyan border border-cyber-cyan/60 bg-cyber-cyan/15 hover:bg-cyber-cyan hover:text-black transition-all rounded shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            data-cursor="access"
            onClick={(e) => {
              e.preventDefault();
              sound.playButtonConfirm();
              document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping hidden sm:inline-block" />
            <span>ACCESS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Quick Partner CTA */}
          <a
            href="#partner"
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-cyber-red border border-cyber-red/50 bg-cyber-red/10 hover:bg-cyber-red hover:text-white transition-all rounded shadow-[0_0_15px_rgba(255,31,67,0.2)]"
            data-cursor="enter"
            onClick={() => sound.playButtonConfirm()}
          >
            <span>PARTNER</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              sound.playHoverClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 rounded border border-cyber-border text-white/80 hover:text-white hover:border-cyber-cyan"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#040507]/98 border-b border-cyber-border/80 px-6 py-6 animate-in slide-in-from-top-4">
          <nav className="flex flex-col gap-4 font-mono text-sm tracking-wider">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  sound.playHoverClick();
                  setMobileMenuOpen(false);
                }}
                className="py-2 border-b border-white/5 text-white/80 hover:text-cyber-cyan transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-white/20 text-xs font-mono">&gt;</span>
              </a>
            ))}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="flex-1 py-2 text-xs font-mono border border-cyber-border bg-cyber-panel text-center text-white/80"
              >
                REPLAY CINEMATIC
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTerminal();
                }}
                className="flex-1 py-2 text-xs font-mono border border-cyber-cyan/50 text-cyber-cyan text-center bg-cyber-cyan/10"
              >
                LAUNCH CLI
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
