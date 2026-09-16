// AudioManager — simple synthesized SFX via Web Audio API, no external assets
const AudioManager = {
  ctx: null,
  enabled: true,

  init() {
    this.enabled = StorageManager.getSound();
    // AudioContext created lazily on first user gesture (browser autoplay policy)
  },

  ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  setEnabled(val) {
    this.enabled = val;
    StorageManager.saveSound(val);
  },

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  },

  _tone({ freq = 440, type = 'square', duration = 0.1, gainStart = 0.15, gainEnd = 0.0001, freqEnd = null, delay = 0 }) {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + duration);
    }
    gain.gain.setValueAtTime(gainStart, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), t0 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  },

  shoot() {
    this._tone({ freq: 720, freqEnd: 900, type: 'square', duration: 0.08, gainStart: 0.08 });
  },

  hit() {
    this._tone({ freq: 220, freqEnd: 120, type: 'sawtooth', duration: 0.12, gainStart: 0.12 });
  },

  split() {
    this._tone({ freq: 500, freqEnd: 260, type: 'triangle', duration: 0.15, gainStart: 0.14 });
    this._tone({ freq: 640, freqEnd: 320, type: 'triangle', duration: 0.15, gainStart: 0.1, delay: 0.03 });
  },

  mrrGained() {
    this._tone({ freq: 523, type: 'square', duration: 0.09, gainStart: 0.12 });
    this._tone({ freq: 659, type: 'square', duration: 0.09, gainStart: 0.12, delay: 0.09 });
    this._tone({ freq: 784, type: 'square', duration: 0.14, gainStart: 0.12, delay: 0.18 });
  },

  playerHit() {
    this._tone({ freq: 180, freqEnd: 60, type: 'sawtooth', duration: 0.3, gainStart: 0.16 });
  },

  lifeGained() {
    this._tone({ freq: 440, freqEnd: 880, type: 'triangle', duration: 0.18, gainStart: 0.14 });
    this._tone({ freq: 660, freqEnd: 1320, type: 'triangle', duration: 0.18, gainStart: 0.1, delay: 0.08 });
  },

  bonusMrr() {
    this._tone({ freq: 587, type: 'square', duration: 0.1, gainStart: 0.13 });
    this._tone({ freq: 880, type: 'square', duration: 0.16, gainStart: 0.13, delay: 0.1 });
  },

  win() {
    [523, 659, 784, 1046].forEach((f, i) => {
      this._tone({ freq: f, type: 'square', duration: 0.2, gainStart: 0.14, delay: i * 0.14 });
    });
  },

  lose() {
    [392, 349, 294, 220].forEach((f, i) => {
      this._tone({ freq: f, type: 'sawtooth', duration: 0.25, gainStart: 0.14, delay: i * 0.15 });
    });
  },
};
