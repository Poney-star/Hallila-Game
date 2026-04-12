window.PPB = window.PPB || {};

window.PPB.AudioManager = class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.music = null;
    this.finale = null;
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  ensureMusic() {
    if (this.music) return this.music;
    const cfg = window.PPB && window.PPB.CONFIG ? window.PPB.CONFIG : {};
    this.music = new Audio(cfg.MUSIC_SRC || 'assets/audio/aDoom.ogg');
    this.music.loop = true;
    this.music.preload = 'auto';
    this.music.volume = typeof cfg.MUSIC_VOLUME === 'number' ? cfg.MUSIC_VOLUME : 0.32;
    return this.music;
  }

  ensureFinale() {
    if (this.finale) return this.finale;
    const cfg = window.PPB && window.PPB.CONFIG ? window.PPB.CONFIG : {};
    this.finale = new Audio(cfg.FINALE_AUDIO_SRC || 'assets/audio/finale.m4a');
    this.finale.loop = false;
    this.finale.preload = 'auto';
    this.finale.volume = 1;
    return this.finale;
  }

  startMusic() {
    const music = this.ensureMusic();
    this.stopFinale();
    if (!this.enabled) return;
    music.currentTime = 0;
    const promise = music.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }

  stopMusic() {
    const music = this.ensureMusic();
    music.pause();
  }

  playFinale() {
    const finale = this.ensureFinale();
    this.stopMusic();
    if (!this.enabled) return;
    finale.currentTime = 0;
    const promise = finale.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {});
  }

  stopFinale() {
    const finale = this.ensureFinale();
    finale.pause();
    finale.currentTime = 0;
  }

  syncMusicState() {
    const music = this.ensureMusic();
    const finale = this.ensureFinale();
    music.muted = !this.enabled;
    finale.muted = !this.enabled;
    if (!this.enabled) {
      music.pause();
      finale.pause();
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
    this.syncMusicState();
  }

  beep({ frequency = 440, duration = 0.08, type = 'sine', gain = 0.03, glideTo = null }) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + duration);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  shoot() {
    this.beep({ frequency: 780, glideTo: 510, duration: 0.05, type: 'triangle', gain: 0.026 });
  }

  hit() {
    this.beep({ frequency: 600, glideTo: 980, duration: 0.08, type: 'square', gain: 0.03 });
  }

  armorHit() {
    this.beep({ frequency: 260, glideTo: 330, duration: 0.07, type: 'square', gain: 0.028 });
  }

  miss() {
    this.beep({ frequency: 180, glideTo: 130, duration: 0.16, type: 'sawtooth', gain: 0.03 });
  }

  levelUp() {
    [520, 650, 820].forEach((f, i) => {
      setTimeout(() => this.beep({ frequency: f, duration: 0.12, type: 'triangle', gain: 0.03 }), i * 100);
    });
  }

  win() {
    [520, 660, 830, 1040].forEach((f, i) => {
      setTimeout(() => this.beep({ frequency: f, duration: 0.16, type: 'triangle', gain: 0.03 }), i * 120);
    });
  }
};
