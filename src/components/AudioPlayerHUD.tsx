import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export const AudioPlayerHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Auto start soundtrack on first user click if not muted
    const onUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (!sound.getIsMuted()) {
          sound.startAmbientSoundtrack();
        }
      }
    };
    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('keydown', onUserInteraction, { once: true });
    return () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
    };
  }, [hasInteracted]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3">
      <button
        onClick={toggleSound}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all shadow-xl font-mono text-xs ${
          isMuted
            ? 'border-white/10 bg-black/60 text-white/50 hover:text-white hover:border-white/30'
            : 'border-cyber-cyan/50 bg-cyber-surface/80 text-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]'
        }`}
        data-cursor="access"
        title={isMuted ? 'Click to Enable Soundtrack & Cyber SFX' : 'Click to Mute Audio'}
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/40" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyber-cyan animate-pulse" />
          )}
        </div>

        {/* Animated Audio Frequency Bars */}
        {!isMuted && (
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-cyber-cyan animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
            <span className="w-0.5 bg-cyber-cyan animate-[pulse_1.2s_ease-in-out_infinite] h-2/3" />
            <span className="w-0.5 bg-cyber-cyan animate-[pulse_0.6s_ease-in-out_infinite] h-4/5" />
            <span className="w-0.5 bg-cyber-cyan animate-[pulse_1.0s_ease-in-out_infinite] h-1/2" />
          </div>
        )}

        <span className="font-bold text-[10px] tracking-wider uppercase">
          {isMuted ? 'SOUND: OFF' : 'SOUNDTRACK: ACTIVE'}
        </span>
      </button>
    </div>
  );
};
