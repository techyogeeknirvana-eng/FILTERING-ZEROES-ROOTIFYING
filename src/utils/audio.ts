// Procedural Cinematic Web Audio Engine & Multi-Channel Soundtrack
// FILTERING ZEROES: ROOTIFYING

export type AudioChannel = 'master' | 'music' | 'sfx' | 'ambience';

class CinematicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Channel Gains
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;

  // Channel Volume Levels (0.0 to 1.0)
  private masterVol: number = 0.8;
  private musicVol: number = 0.65;
  private sfxVol: number = 0.85;
  private ambienceVol: number = 0.6;

  // Ambient Drone & Soundtrack
  private isAmbientPlaying: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneLFO: OscillatorNode | null = null;
  private musicInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('fz_sound_muted');
      this.isMuted = savedMute !== null ? savedMute === 'true' : false;

      const savedMaster = localStorage.getItem('fz_audio_master');
      if (savedMaster !== null) this.masterVol = Math.max(0, Math.min(1, parseFloat(savedMaster)));

      const savedMusic = localStorage.getItem('fz_audio_music');
      if (savedMusic !== null) this.musicVol = Math.max(0, Math.min(1, parseFloat(savedMusic)));

      const savedSfx = localStorage.getItem('fz_audio_sfx');
      if (savedSfx !== null) this.sfxVol = Math.max(0, Math.min(1, parseFloat(savedSfx)));

      const savedAmbience = localStorage.getItem('fz_audio_ambience');
      if (savedAmbience !== null) this.ambienceVol = Math.max(0, Math.min(1, parseFloat(savedAmbience)));
    }
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Create Channel Gain Architecture
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.ambienceGain = this.ctx.createGain();
        this.ambienceGain.gain.setValueAtTime(this.ambienceVol, this.ctx.currentTime);
        this.ambienceGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ==========================================
  // VOLUME & MUTE CONTROLS
  // ==========================================
  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('fz_sound_muted', String(this.isMuted));

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.masterVol,
        this.ctx.currentTime
      );
    }

    if (!this.isMuted) {
      this.initCtx();
      this.startAmbientSoundtrack();
      this.playSystemActivation();
    } else {
      this.stopAmbientSoundtrack();
    }
    return this.isMuted;
  }

  public setChannelVolume(channel: AudioChannel, vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.initCtx();

    if (channel === 'master') {
      this.masterVol = clamped;
      localStorage.setItem('fz_audio_master', String(clamped));
      if (this.masterGain && this.ctx && !this.isMuted) {
        this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    } else if (channel === 'music') {
      this.musicVol = clamped;
      localStorage.setItem('fz_audio_music', String(clamped));
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    } else if (channel === 'sfx') {
      this.sfxVol = clamped;
      localStorage.setItem('fz_audio_sfx', String(clamped));
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    } else if (channel === 'ambience') {
      this.ambienceVol = clamped;
      localStorage.setItem('fz_audio_ambience', String(clamped));
      if (this.ambienceGain && this.ctx) {
        this.ambienceGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    }
  }

  public getMasterVolume(): number { return this.masterVol; }
  public getMusicVolume(): number { return this.musicVol; }
  public getSfxVolume(): number { return this.sfxVol; }
  public getAmbienceVolume(): number { return this.ambienceVol; }

  // ==========================================
  // BACKGROUND CINEMATIC AMBIENT SOUNDTRACK
  // ==========================================
  public startAmbientSoundtrack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.ambienceGain || this.isAmbientPlaying) return;

    try {
      // Deep drone oscillators
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(55.6, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      this.droneLFO = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.droneLFO.frequency.setValueAtTime(0.07, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(50, this.ctx.currentTime);

      this.droneLFO.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.ambienceGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.droneLFO.start();
      this.isAmbientPlaying = true;

      // Periodic subtle atmospheric cyber arpeggio (every 3.6 seconds)
      const pentatonicNotes = [220, 277.18, 329.63, 440, 554.37];
      let noteIdx = 0;

      if (!this.musicInterval) {
        this.musicInterval = window.setInterval(() => {
          if (this.isMuted || !this.ctx || !this.musicGain || !this.isAmbientPlaying) return;
          const note = pentatonicNotes[noteIdx % pentatonicNotes.length];
          noteIdx++;

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.035, this.ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

          osc.connect(gain);
          gain.connect(this.musicGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 1.9);
        }, 3600);
      }
    } catch {}
  }

  public stopAmbientSoundtrack() {
    if (!this.ctx) return;
    try {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneLFO?.stop();
          this.isAmbientPlaying = false;
        } catch {}
      }, 300);
    } catch {}
  }

  // ==========================================
  // FOOTSTEP & LOCOMOTION SFX
  // ==========================================
  public playFootstep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft mechanical cyber-tick
      osc.type = 'triangle';
      const baseFreq = 480 + Math.random() * 120;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.03);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  // ==========================================
  // 5-STEP NODE AUTHENTICATION SFX
  // ==========================================
  // Step 1: Node Detected Radar Sweep
  public playNodeDetected() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // Step 2: Node Scanning Arpeggio
  public playNodeScanning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const pitches = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    pitches.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + idx * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.035, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.09);
    });
  }

  // Step 3: Access Verified Double Chime
  public playAccessVerified() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const freqs = [784, 1174.66];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = this.ctx.currentTime + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.19);
    });
  }

  // Step 4: Connection Established Digital Lock
  public playConnectionEstablished() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(196, this.ctx.currentTime); // G3
    osc.frequency.exponentialRampToValueAtTime(392, this.ctx.currentTime + 0.12);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.23);
  }

  // Step 5: Access Granted Rewarding Cyber Unlock Fanfare
  public playAccessGranted() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const chord = [440, 554.37, 659.25, 880, 1108.73]; // A major 9
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  // Navigation Whoosh / Transit
  public playNavWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.33);
  }

  public playSlashWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.36);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.38);
  }

  public playBinaryGlitchBurst() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  public playDomainReveal(freq = 440) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.46);
  }

  public playZeroToOneTransformation() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.8);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.92);
    osc2.stop(this.ctx.currentTime + 0.92);
  }

  public playAtmosphericSwell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.65);
  }

  // ==========================================
  // CINEMATIC SOUND FX (EXISTING REUSED)
  // ==========================================
  public playSubBassRumble() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(42, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 2.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.3);
  }

  public playHeartbeat(strength = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.32 * strength, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);

    setTimeout(() => {
      if (this.isMuted || !this.ctx || !this.sfxGain) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(58, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.2);
      gain2.gain.setValueAtTime(0.22 * strength, this.ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start();
      osc2.stop(this.ctx.currentTime + 0.25);
    }, 120);
  }

  public playBladeHum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 1.4);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.65);
  }

  public playTensionRise() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 2.0);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 1.6);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.2);
  }

  public playAwakeningGlitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  public playSoulImpact() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.1);
  }

  // ==========================================
  // UI INTERACTIONS
  // ==========================================
  public playHoverClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  public playButtonConfirm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.11);
  }

  public playClassifiedBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.075);
  }

  public playTerminalKeystroke() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 600, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  public playSystemActivation() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.55);
  }

  public playDenied() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.setValueAtTime(105, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  public playBeep(freq = 900, duration = 0.04, vol = 0.04) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.01);
  }
}

export const sound = new CinematicSoundEngine();
