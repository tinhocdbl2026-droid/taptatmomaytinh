/**
 * Sound effects engine using Web Audio API and Speech Synthesis for Vietnamese primary education.
 * Synthesizes mechanical clicks, cooling fans, Windows-like boot chimes, keypresses, and voice hints.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private fanGain: GainNode | null = null;
  private fanOsc: OscillatorNode | null = null;
  private fanNoise: AudioBufferSourceNode | null = null;
  public soundEnabled: boolean = true;
  public voiceEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic mechanical button click (Power button)
  playPowerClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Heavy click: Low-thump + metal snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Snap transient
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'square';
      snap.frequency.setValueAtTime(1200, now);
      snap.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      snapGain.gain.setValueAtTime(0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      snap.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snap.start(now);
      snap.stop(now + 0.04);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Reset button click (higher pitched, smaller tactile feel)
  playResetClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // audio error ignore
    }
  }

  // Key press sound
  playKeyPress() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      // randomize pitch slightly for realistic mechanical typing
      const freq = 600 + Math.random() * 200;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Mouse click sound
  playMouseClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // Gentle fan noise while PC tower is active
  startFanNoise() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.stopFanNoise();

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.fanNoise = this.ctx.createBufferSource();
      this.fanNoise.buffer = buffer;
      this.fanNoise.loop = true;

      // Filter noise to sound like a gentle PC fan whirring
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.fanGain = this.ctx.createGain();
      this.fanGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.fanGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 1.2);

      this.fanNoise.connect(filter);
      filter.connect(this.fanGain);
      this.fanGain.connect(this.ctx.destination);

      this.fanNoise.start();
    } catch {
      // ignore
    }
  }

  stopFanNoise() {
    try {
      if (this.fanGain && this.ctx) {
        this.fanGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          if (this.fanNoise) {
            try { this.fanNoise.stop(); } catch {}
            this.fanNoise.disconnect();
            this.fanNoise = null;
          }
        }, 900);
      }
    } catch {
      // ignore
    }
  }

  // Windows 11 / Mac style modern pleasant startup chime chord
  playStartupChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + 0.1;

      // Chord: Eb4, Bb4, Eb5, G5, Bb5 (Bright, joyful, friendly)
      const notes = [
        { f: 311.13, delay: 0.0, dur: 2.2, gain: 0.18 }, // Eb4
        { f: 466.16, delay: 0.1, dur: 2.3, gain: 0.22 }, // Bb4
        { f: 622.25, delay: 0.2, dur: 2.5, gain: 0.24 }, // Eb5
        { f: 783.99, delay: 0.35, dur: 2.8, gain: 0.26 }, // G5
        { f: 932.33, delay: 0.5, dur: 3.0, gain: 0.20 },  // Bb5
      ];

      notes.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.delay);

        gain.gain.setValueAtTime(0.001, now + note.delay);
        gain.gain.linearRampToValueAtTime(note.gain, now + note.delay + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.dur + 0.1);
      });
    } catch {
      // ignore
    }
  }

  // Peaceful shutdown sound (descending soft notes)
  playShutdownChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + 0.05;

      const notes = [
        { f: 783.99, delay: 0.0, dur: 1.2, gain: 0.2 }, // G5
        { f: 622.25, delay: 0.25, dur: 1.4, gain: 0.18 }, // Eb5
        { f: 466.16, delay: 0.55, dur: 1.6, gain: 0.16 }, // Bb4
        { f: 311.13, delay: 0.9, dur: 2.0, gain: 0.14 },  // Eb4
      ];

      notes.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.delay);

        gain.gain.setValueAtTime(0.001, now + note.delay);
        gain.gain.linearRampToValueAtTime(note.gain, now + note.delay + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + note.dur + 0.1);
      });
    } catch {
      // ignore
    }
  }

  // Success celebration chime
  playCelebration() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Wrong action or warning beep
  playWarningSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  // Voice narration in Vietnamese for Grade 1 children
  speakVietnamese(text: string) {
    if (!this.voiceEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.92; // Slightly slower and clear for grade 1 kids
      utterance.pitch = 1.15; // Friendly and cheerful tone

      // Try finding Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VIE'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synth restrictions
    }
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEngine = new SoundEngine();
