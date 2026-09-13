import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayIntro: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onReplayIntro,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ cmd?: string; text: string; type?: string }>>([
    { text: 'FILTERING ZEROES: ROOTIFYING [VERSION 1.0.4-SOVEREIGN]' },
    { text: 'TYPE "help" TO VIEW AUTHORIZED COMMANDS.' },
    { text: 'CORE PHILOSOPHY: BORN IN THE 0. RESURRECTED IN THE 1.' },
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      sound.playBeep(1200, 0.05, 0.08);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = input.trim().toLowerCase();
    if (!clean) return;

    sound.playBeep(950, 0.02, 0.04);
    const newItems: Array<{ cmd?: string; text: string; type?: string }> = [
      { cmd: input, text: `> ${input}` },
    ];

    switch (clean) {
      case 'help':
        newItems.push({
          text: `AVAILABLE COMMANDS:
  help       - Display this list of diagnostic directives
  manifesto  - Output the foundational Root philosophy
  domains    - Display the 4 intersecting technology worlds
  partner    - Launch community partner registration gateway
  intro      - Re-trigger the cinematic boot & blade slash experience
  status     - Query current telemetry and clearance level
  sound      - Toggle cyber procedural Web Audio synthesis
  clear      - Purge screen buffer
  exit       - Terminate terminal session`,
        });
        break;

      case 'manifesto':
        newItems.push({
          text: `“Everyone sees zero as nothing. We see zero as possibility.
Every hacker starts somewhere. Every founder starts with an idea.
Every system starts from an empty architecture. Every breakthrough starts with a question.
Filtering Zeroes is about filtering the noise, finding the signal, going to the root,
and turning possibility into impact.”
BORN IN THE 0. RESURRECTED IN THE 1.`,
          type: 'quote',
        });
        break;

      case 'domains':
        newItems.push({
          text: `[01] AI: Think · Create · Automate · Intelligence
[02] CYBERSECURITY: Break · Defend · Trace · Secure
[03] CLOUD: Build · Scale · Deploy · Resilience
[04] ENTREPRENEURSHIP: Imagine · Validate · Build · Scale`,
        });
        break;

      case 'partner':
        window.open(
          'https://docs.google.com/forms/d/1lDHES3lIdxrCKSNH2Ue-k2s26zMMcTSl4P0aloMZp80/edit',
          '_blank'
        );
        newItems.push({
          text: 'DIRECTIVE EXECUTED: Launching official Google Form partner portal...',
          type: 'success',
        });
        break;

      case 'intro':
        onClose();
        onReplayIntro();
        return;

      case 'status':
        newItems.push({
          text: `SYS_STATUS: ACTIVE
CLEARANCE: PUBLIC TRANSIT
ACTIVE WORLDS: AI, CYBER, CLOUD, ENTREPRENEURSHIP
STAGE: PRE-LAUNCH // PHASE 1
MANAGEMENT: TYGN B.Tech Student Community × Events INFO`,
        });
        break;

      case 'sound': {
        const isMuted = sound.toggleMute();
        newItems.push({
          text: `AUDIO PROTOCOL: ${isMuted ? 'MUTED' : 'ACTIVE / UNMUTED'}`,
        });
        break;
      }

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        sound.playDenied();
        newItems.push({
          text: `COMMAND NOT RECOGNIZED: "${clean}". TYPE "help" FOR VALID COMMANDS.`,
          type: 'error',
        });
        break;
    }

    setHistory((prev) => [...prev, ...newItems]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-xl border border-cyber-border bg-[#05070c] shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#080b12] border-b border-cyber-border">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan">
            <TerminalIcon className="w-4 h-4" />
            <span className="font-bold">ROOTIFY SHELL // ROOT_ACCESS_CONSOLE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Output Screen */}
        <div
          ref={scrollRef}
          className="p-4 h-80 overflow-y-auto font-mono text-xs space-y-2 text-white/80 select-text"
        >
          {history.map((item, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap leading-relaxed ${
                item.type === 'error'
                  ? 'text-cyber-red font-semibold'
                  : item.type === 'quote'
                  ? 'text-cyber-cyan italic border-l-2 border-cyber-cyan pl-2 py-1'
                  : item.type === 'success'
                  ? 'text-brand-green font-semibold'
                  : item.cmd
                  ? 'text-white/90 font-bold'
                  : 'text-white/70'
              }`}
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* Command Line Input */}
        <form
          onSubmit={handleCommand}
          className="flex items-center gap-2 p-3 bg-[#080b12] border-t border-cyber-border font-mono text-xs"
        >
          <span className="text-cyber-cyan font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' for command listing..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-white/30"
          />
          <button
            type="submit"
            className="p-1 text-white/50 hover:text-cyber-cyan transition-colors"
            title="Execute Command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
