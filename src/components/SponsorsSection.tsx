import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Lock, Send, Check } from 'lucide-react';

export const SponsorsSection: React.FC = () => {
  const [inquirySent, setInquirySent] = useState(false);
  const [email, setEmail] = useState('');

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setInquirySent(true);
    sound.playBeep(1100, 0.05, 0.1);
    setTimeout(() => {
      setEmail('');
      setInquirySent(false);
    }, 4000);
  };

  return (
    <section id="sponsors" className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/50">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 font-mono text-xs tracking-widest uppercase">
            <span>SOVEREIGN BACKERS</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            SPONSORS
          </h2>
          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-white/90 tracking-wide max-w-2xl">
            “THE ONES WHO MAKE THE IMPOSSIBLE POSSIBLE.”
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-yellow-400 to-cyber-cyan my-6" />
        </div>

        <div className="p-8 sm:p-12 rounded-2xl border border-cyber-border bg-cyber-surface/50 backdrop-blur-xl relative text-center flex flex-col items-center max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-cyber-panel/80 mb-6 relative">
            <Lock className="w-7 h-7 text-yellow-400" />
            <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-ping" />
          </div>

          <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-widest uppercase mb-2">
            SPONSORS COMING SOON
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/60 tracking-wider max-w-xl mb-8">
            Underwriter consortium vetting is currently underway. Strategic partners and technology patrons will be unveiled during the Phase 2 broadcast.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-10">
            {['ALPHA PATRON', 'INFRASTRUCTURE TIER', 'CYBER SHIELD', 'AI ENCLAVE'].map((tier) => (
              <div
                key={tier}
                className="p-4 rounded border border-dashed border-white/15 bg-black/40 flex flex-col items-center justify-center gap-2"
              >
                <span className="font-mono text-[9px] text-white/40 tracking-wider">TIER PROTOCOL</span>
                <span className="font-mono text-xs font-bold text-white/70">{tier}</span>
                <span className="font-mono text-[9px] text-yellow-400/80">[ RESERVED ]</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-md">
            {inquirySent ? (
              <div className="p-4 rounded bg-brand-green/10 border border-brand-green text-brand-green font-mono text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>SPONSOR DOSSIER INQUIRY TRANSMITTED</span>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter.corporate@enterprise.com"
                  className="flex-1 px-4 py-2.5 rounded bg-[#040507] border border-white/20 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-yellow-400"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-yellow-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
                  data-cursor="access"
                >
                  <span>REQUEST DECK</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <div className="mt-3 font-mono text-[10px] text-white/40">
              OR EMAIL DIRECTLY: <span className="text-white/70">partnerships@filteringzeroes.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
