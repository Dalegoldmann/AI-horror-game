/**
 * Procedural Horror Web Audio Synthesizer
 * Generates analog tape hiss/static, sub-bass subterranean drone,
 * heartbeat pulses, and mechanical terminal clicks without external audio files.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;

  // Static/noise nodes
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  // Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  // Heartbeat loop timer
  private heartbeatInterval: number | null = null;
  private currentBpm: number = 60;

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.initNoiseGenerator();
    this.initDroneGenerator();
  }

  private initNoiseGenerator() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 5 seconds of brown/pink noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration filter
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like damp cavern atmosphere & vintage radio static
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
  }

  private initDroneGenerator() {
    if (!this.ctx || !this.masterGain) return;

    // Low sub-bass sine tone with subtle detuned binaural beat
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(48, this.ctx.currentTime);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(51.5, this.ctx.currentTime); // 3.5Hz beat frequency

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    this.droneOsc1.connect(this.droneGain);
    this.droneOsc2.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  public setTension(level: number) {
    // level: 1 to 10
    if (!this.ctx) return;
    const norm = Math.min(Math.max((level - 1) / 9, 0), 1);
    
    // As tension rises, static becomes harsher and frequency opens up
    if (this.noiseFilter) {
      this.noiseFilter.frequency.setTargetAtTime(350 + norm * 450, this.ctx.currentTime, 0.4);
    }
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0.2 + norm * 0.15, this.ctx.currentTime, 0.4);
    }
    if (this.droneOsc1 && this.droneOsc2) {
      this.droneOsc1.frequency.setTargetAtTime(46 + norm * 8, this.ctx.currentTime, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(49.5 + norm * 9.5, this.ctx.currentTime, 0.5);
    }

    this.currentBpm = 50 + norm * 65; // from 50 bpm to 115 bpm
  }

  public toggleMute(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return this.isMuted;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0.0001 : 0.65;
    
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);

    if (this.isMuted) {
      this.stopHeartbeat();
    } else {
      this.startHeartbeat();
      this.playMechanicalClick();
    }

    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playMechanicalClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.035);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  public playHoverTone() {
    if (this.isMuted) return;
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.02);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.035);
  }

  public playDeepThump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.25);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playFatalDeath() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Crushing low frequency impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(18, t + 0.75);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, t);
    filter.frequency.exponentialRampToValueAtTime(35, t + 0.75);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  private triggerHeartbeatBeat() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // First beat: Lub
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, t);
    osc1.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    gain1.gain.setValueAtTime(0.25, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.15);

    // Second beat: Dub (120ms later)
    const t2 = t + 0.13;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(58, t2);
    osc2.frequency.exponentialRampToValueAtTime(28, t2 + 0.1);

    gain2.gain.setValueAtTime(0.18, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.12);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t2);
    osc2.stop(t2 + 0.14);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    const scheduleNext = () => {
      this.triggerHeartbeatBeat();
      const intervalMs = (60 / this.currentBpm) * 1000;
      this.heartbeatInterval = window.setTimeout(scheduleNext, intervalMs);
    };
    scheduleNext();
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval !== null) {
      window.clearTimeout(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
