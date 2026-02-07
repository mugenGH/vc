// Sound Manager - Audio Effects System

export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initialized = false;
  }

  ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;
      this.initialized = true;
    }
  }

  playEffect(effectName, duration = 0.5) {
    this.ensureContext();

    const now = this.audioContext.currentTime;
    const effectMethods = {
      whisper: () => this.createWhisper(now, duration),
      breathing: () => this.createBreathing(now, duration),
      door: () => this.createDoor(now, duration),
      heartbeat: () => this.createHeartbeat(now, duration),
      scare: () => this.createScare(now, duration),
      scrape: () => this.createScrape(now, duration)
    };

    if (effectMethods[effectName]) {
      effectMethods[effectName]();
    }
  }

  createWhisper(now, duration) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  createBreathing(now, duration) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(120, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(80, now + duration);
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.5);
    gain.gain.linearRampToValueAtTime(0.02, now + duration);
    
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  createDoor(now, duration) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + duration);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  createHeartbeat(now, duration) {
    const makeThump = (time, pitch) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.frequency.setValueAtTime(pitch, time);
      osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
      
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0, time + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.15);
    };

    makeThump(now, 150);
    makeThump(now + 0.1, 100);
    makeThump(now + 0.35, 150);
    makeThump(now + 0.45, 100);
  }

  createScare(now, duration) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + duration * 0.3);
    osc.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  createScrape(now, duration) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(100, now + duration);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0, now + duration);
    
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  playBackground(loopName) {
    if (loopName === 'ambient') {
      setInterval(() => {
        this.playEffect('whisper', 0.8);
      }, 4000);
    } else if (loopName === 'tension') {
      setInterval(() => {
        this.playEffect('breathing', 1);
      }, 3000);
    }
  }

  playDialogue() {
    this.playEffect('breathing', 0.3);
  }

  playPuzzleSuccess() {
    this.playEffect('door', 0.5);
  }

  playPuzzleFail() {
    this.playEffect('scare', 0.4);
  }

  playScareEvent() {
    this.playEffect('scare', 0.8);
    setTimeout(() => {
      this.playEffect('scrape', 0.6);
    }, 200);
  }

  playAnticipation() {
    this.playEffect('heartbeat', 0.6);
  }
}

export const soundManager = new SoundManager();
