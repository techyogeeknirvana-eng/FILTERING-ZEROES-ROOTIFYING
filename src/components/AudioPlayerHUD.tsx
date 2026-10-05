import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders, X } from 'lucide-react';
import { sound, type AudioChannel } from '../utils/audio';

export const AudioPlayerHUD: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Channels state
  const [masterVol, setMasterVol] = useState(sound.getMasterVolume());
  const [musicVol, setMusicVol] = useState(sound.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(sound.getSfxVolume());
  const [ambienceVol, setAmbienceVol] = useState(sound.getAmbienceVolume());

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

  const handleSliderChange = (channel: AudioChannel, val: number) => {
    sound.setChannelVolume(channel, val);
    if (channel === 'master') setMasterVol(val);
    else if (channel === 'music') setMusicVol(val);
    else if (channel === 'sfx') setSfxVol(val);
    else if (channel === 'ambience') setAmbienceVol(val);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 select-none">
      {/* Main Sound Status / Toggle Button */}
      <button
        onClick={toggleSound}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all shadow-xl font-mono text-xs cursor-pointer ${
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
          {isMuted ? 'SOUND: OFF' : 'AUDIO: ACTIVE'}
        </span>
      </button>

      {/* Sliders / Audio Settings Modal Trigger */}
      <button
        onClick={() => {
          sound.playHoverClick();
          setIsSettingsOpen(!isSettingsOpen);
        }}
        className="w-8 h-8 rounded-full border border-white/15 bg-black/60 hover:bg-black/90 text-white/60 hover:text-cyber-cyan hover:border-cyber-cyan transition-all flex items-center justify-center cursor-pointer shadow-lg"
        title="Open Audio Channel Mixer"
      >
        <Sliders className="w-3.5 h-3.5" />
      </button>

      {/* Audio Mixer Popover */}
      {isSettingsOpen && (
        <div className="absolute bottom-12 left-0 w-72 rounded-xl bg-[#07090f]/95 border border-cyber-cyan/40 p-4 shadow-[0_0_35px_rgba(0,240,255,0.2)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs">
            <span className="font-bold text-cyber-cyan font-mono tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" />
              // AUDIO MATRIX
            </span>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {/* Master Slider */}
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>MASTER</span>
                <span className="text-cyber-cyan font-bold">{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={(e) => handleSliderChange('master', parseFloat(e.target.value))}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
            </div>

            {/* Music Slider */}
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>MUSIC / OST</span>
                <span className="text-cyber-cyan font-bold">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleSliderChange('music', parseFloat(e.target.value))}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
            </div>

            {/* SFX Slider */}
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>CYBER SFX</span>
                <span className="text-cyber-cyan font-bold">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  handleSliderChange('sfx', val);
                  sound.playHoverClick();
                }}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
            </div>

            {/* Ambience Slider */}
            <div>
              <div className="flex justify-between text-white/70 mb-1">
                <span>AMBIENCE DRONE</span>
                <span className="text-cyber-cyan font-bold">{Math.round(ambienceVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambienceVol}
                onChange={(e) => handleSliderChange('ambience', parseFloat(e.target.value))}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Mute Toggle */}
          <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center text-[10px]">
            <span className="text-white/40">SYSTEM OUTPUT</span>
            <button
              onClick={toggleSound}
              className={`px-2.5 py-1 rounded border text-[10px] font-bold cursor-pointer transition-colors ${
                isMuted
                  ? 'border-cyber-red/50 bg-cyber-red/10 text-cyber-red'
                  : 'border-brand-green/50 bg-brand-green/10 text-brand-green'
              }`}
            >
              {isMuted ? '[ MUTED ]' : '[ ACTIVE ]'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
