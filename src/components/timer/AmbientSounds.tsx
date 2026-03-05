import { useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, TreePine, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';

const AMBIENT_OPTIONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'rain', label: 'Rain', Icon: CloudRain },
  { id: 'forest', label: 'Forest', Icon: TreePine },
  { id: 'ocean', label: 'Ocean', Icon: Waves },
];

// ─── Noise buffers ───────────────────────────────────────────────────────────

function makeWhiteBuffer(ctx: AudioContext, seconds = 10): AudioBuffer {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function makePinkBuffer(ctx: AudioContext, seconds = 10): AudioBuffer {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.96900 * b2 + w * 0.1538520;
      b3 = 0.86650 * b3 + w * 0.3104856;
      b4 = 0.55000 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.0168980;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  }
  return buf;
}

function makeBrownBuffer(ctx: AudioContext, seconds = 10): AudioBuffer {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = (last + 0.02 * w) / 1.02;
      last = d[i];
      d[i] *= 3.5;
    }
  }
  return buf;
}

function loopSource(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  // Randomize start offset so stereo channels don't phase-cancel
  src.loopStart = 0;
  src.loopEnd = buffer.duration;
  return src;
}

// ─── Main generator class ────────────────────────────────────────────────────

class AmbientGenerator {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private chirpTimer: ReturnType<typeof setTimeout> | null = null;

  start(type: string, volume: number) {
    this.stop();
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = volume;
      this.master.connect(this.ctx.destination);

      switch (type) {
        case 'rain':   this.buildRain(); break;
        case 'ocean':  this.buildOcean(); break;
        case 'forest': this.buildForest(); break;
        case 'coffee': this.buildCafe(); break;
      }
    } catch { /* ignore */ }
  }

  // ── Rain ────────────────────────────────────────────────────────────────────
  // Layers: high-band spray + mid rain + low thunder rumble + wave LFO
  private buildRain() {
    const ctx = this.ctx!;
    const out = this.master!;

    // Layer 1 — high-frequency spray (droplets hitting surfaces)
    const whiteBuf = makeWhiteBuffer(ctx, 12);
    const spray = loopSource(ctx, whiteBuf);
    const hiPass = ctx.createBiquadFilter();
    hiPass.type = 'bandpass';
    hiPass.frequency.value = 5500;
    hiPass.Q.value = 0.6;
    const sprayGain = ctx.createGain();
    sprayGain.gain.value = 0.45;
    spray.connect(hiPass);
    hiPass.connect(sprayGain);
    sprayGain.connect(out);
    spray.start();
    this.sources.push(spray);

    // Layer 2 — mid rain body (pink noise, lowpass ~2kHz)
    const pinkBuf = makePinkBuffer(ctx, 15);
    const body = loopSource(ctx, pinkBuf);
    const midLow = ctx.createBiquadFilter();
    midLow.type = 'lowpass';
    midLow.frequency.value = 2200;
    const bodyGain = ctx.createGain();
    bodyGain.gain.value = 0.55;
    body.connect(midLow);
    midLow.connect(bodyGain);
    bodyGain.connect(out);
    body.start();
    this.sources.push(body);

    // Layer 3 — distant thunder rumble (brown noise, very low)
    const brownBuf = makeBrownBuffer(ctx, 8);
    const rumble = loopSource(ctx, brownBuf);
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 120;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.25;
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(out);
    rumble.start();
    this.sources.push(rumble);

    // LFO — slow rain intensity variation (0.04 Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.04;
    const lfoAmt = ctx.createGain();
    lfoAmt.gain.value = 0.12;
    lfo.connect(lfoAmt);
    lfoAmt.connect(bodyGain.gain);
    lfo.start();
    this.sources.push(lfo);
  }

  // ── Ocean ───────────────────────────────────────────────────────────────────
  // Pink noise + very slow wave LFO + surf layer + deep rumble
  private buildOcean() {
    const ctx = this.ctx!;
    const out = this.master!;

    // Layer 1 — main ocean body (pink, lowpass)
    const pinkBuf = makePinkBuffer(ctx, 18);
    const ocean = loopSource(ctx, pinkBuf);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    lp.Q.value = 0.5;
    const oceanGain = ctx.createGain();
    oceanGain.gain.value = 0.5;
    ocean.connect(lp);
    lp.connect(oceanGain);
    oceanGain.connect(out);
    ocean.start();
    this.sources.push(ocean);

    // Wave LFO — ~0.1 Hz (one wave every ~10 s)
    const waveLfo = ctx.createOscillator();
    waveLfo.type = 'sine';
    waveLfo.frequency.value = 0.1;
    const waveAmt = ctx.createGain();
    waveAmt.gain.value = 0.35;
    waveLfo.connect(waveAmt);
    waveAmt.connect(oceanGain.gain);
    waveLfo.start();
    this.sources.push(waveLfo);

    // Sub-wave LFO — slightly offset frequency for realism
    const waveLfo2 = ctx.createOscillator();
    waveLfo2.type = 'sine';
    waveLfo2.frequency.value = 0.067;
    const waveAmt2 = ctx.createGain();
    waveAmt2.gain.value = 0.15;
    waveLfo2.connect(waveAmt2);
    waveAmt2.connect(oceanGain.gain);
    waveLfo2.start();
    this.sources.push(waveLfo2);

    // Layer 2 — surf hiss (white, highpass above 3kHz, quiet)
    const whiteBuf = makeWhiteBuffer(ctx, 10);
    const surf = loopSource(ctx, whiteBuf);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3000;
    const surfGain = ctx.createGain();
    surfGain.gain.value = 0.15;
    surf.connect(hp);
    hp.connect(surfGain);
    surfGain.connect(out);
    surf.start();
    this.sources.push(surf);

    // Surf LFO matches wave LFO
    const surfLfo = ctx.createOscillator();
    surfLfo.type = 'sine';
    surfLfo.frequency.value = 0.1;
    const surfAmt = ctx.createGain();
    surfAmt.gain.value = 0.1;
    surfLfo.connect(surfAmt);
    surfAmt.connect(surfGain.gain);
    surfLfo.start();
    this.sources.push(surfLfo);

    // Layer 3 — deep sub rumble (brown, very low)
    const brownBuf = makeBrownBuffer(ctx, 12);
    const sub = loopSource(ctx, brownBuf);
    const subLp = ctx.createBiquadFilter();
    subLp.type = 'lowpass';
    subLp.frequency.value = 80;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.3;
    sub.connect(subLp);
    subLp.connect(subGain);
    subGain.connect(out);
    sub.start();
    this.sources.push(sub);
  }

  // ── Forest ──────────────────────────────────────────────────────────────────
  // Soft pink noise (leaves/breeze) + synthesized bird chirps
  private buildForest() {
    const ctx = this.ctx!;
    const out = this.master!;

    // Layer 1 — leaves rustling (pink, bandpass ~800-4kHz)
    const pinkBuf = makePinkBuffer(ctx, 14);
    const leaves = loopSource(ctx, pinkBuf);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    bp.Q.value = 0.4;
    const leavesGain = ctx.createGain();
    leavesGain.gain.value = 0.3;
    leaves.connect(bp);
    bp.connect(leavesGain);
    leavesGain.connect(out);
    leaves.start();
    this.sources.push(leaves);

    // Breeze LFO (very slow, 0.06Hz)
    const breezeLfo = ctx.createOscillator();
    breezeLfo.type = 'sine';
    breezeLfo.frequency.value = 0.06;
    const breezeAmt = ctx.createGain();
    breezeAmt.gain.value = 0.15;
    breezeLfo.connect(breezeAmt);
    breezeAmt.connect(leavesGain.gain);
    breezeLfo.start();
    this.sources.push(breezeLfo);

    // Layer 2 — distant ambient (very low white noise)
    const whiteBuf = makeWhiteBuffer(ctx, 10);
    const ambient = loopSource(ctx, whiteBuf);
    const ambLp = ctx.createBiquadFilter();
    ambLp.type = 'lowpass';
    ambLp.frequency.value = 400;
    const ambGain = ctx.createGain();
    ambGain.gain.value = 0.08;
    ambient.connect(ambLp);
    ambLp.connect(ambGain);
    ambGain.connect(out);
    ambient.start();
    this.sources.push(ambient);

    // Bird chirps — scheduled via setTimeout
    this.scheduleChirp(ctx, out);
  }

  private scheduleChirp(ctx: AudioContext, out: GainNode) {
    const delay = 2500 + Math.random() * 6000;
    this.chirpTimer = setTimeout(() => {
      if (!this.ctx) return;
      this.playChirp(ctx, out);
      this.scheduleChirp(ctx, out);
    }, delay);
  }

  private playChirp(ctx: AudioContext, out: GainNode) {
    try {
      // Random bird variety
      const variety = Math.floor(Math.random() * 4);
      const baseFreq = [2800, 3400, 4200, 2200][variety];
      const chirpCount = [3, 2, 1, 4][variety];
      const chirpDuration = [0.08, 0.12, 0.18, 0.06][variety];
      const gap = [0.06, 0.1, 0.25, 0.05][variety];
      const pan = (Math.random() - 0.5) * 1.4;

      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      panner.connect(out);

      for (let i = 0; i < chirpCount; i++) {
        const t = ctx.currentTime + i * (chirpDuration + gap);
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'sine';
        // Frequency sweep (birds glide in pitch)
        osc.frequency.setValueAtTime(baseFreq * (0.9 + Math.random() * 0.3), t);
        osc.frequency.linearRampToValueAtTime(baseFreq * (1.1 + Math.random() * 0.2), t + chirpDuration * 0.6);
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.95, t + chirpDuration);
        // Amplitude envelope
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.06, t + chirpDuration * 0.2);
        env.gain.exponentialRampToValueAtTime(0.001, t + chirpDuration);
        osc.connect(env);
        env.connect(panner);
        osc.start(t);
        osc.stop(t + chirpDuration + 0.02);
      }
    } catch { /* ignore */ }
  }

  setVolume(v: number) {
    if (this.master) this.master.gain.value = v;
  }

  stop() {
    if (this.chirpTimer) { clearTimeout(this.chirpTimer); this.chirpTimer = null; }
    this.sources.forEach(s => { try { s.stop(); } catch { /* ignore */ } });
    this.sources = [];
    try { this.ctx?.close(); } catch { /* ignore */ }
    this.ctx = null;
    this.master = null;
  }
}

const ambient = new AmbientGenerator();

// ─── Component ───────────────────────────────────────────────────────────────

export function AmbientSounds({ accentColor }: { accentColor: string }) {
  const { activeAmbient, ambientVolume, setActiveAmbient, setAmbientVolume } = useTimerStore();
  const { updateAppSettings } = useSettingsStore();

  useEffect(() => {
    if (activeAmbient) {
      ambient.start(activeAmbient, ambientVolume);
    } else {
      ambient.stop();
    }
    return () => ambient.stop();
  }, [activeAmbient]);

  useEffect(() => {
    ambient.setVolume(ambientVolume);
  }, [ambientVolume]);

  const handleVolumeChange = (v: number) => {
    const vol = v / 100;
    setAmbientVolume(vol);
    updateAppSettings({ ambientVolume: vol });
  };

  const toggleAmbient = (id: string) => {
    setActiveAmbient(activeAmbient === id ? null : id);
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
        {activeAmbient ? <Volume2 size={14} /> : <VolumeX size={14} />}
        Ambient Sounds
      </div>

      <div className="flex gap-2">
        {AMBIENT_OPTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => toggleAmbient(id)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-medium transition-all ${
              activeAmbient === id
                ? 'text-white shadow-lg'
                : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
            style={activeAmbient === id ? { background: accentColor } : {}}
            title={label}
          >
            <Icon size={18} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {activeAmbient && (
        <Slider
          min={0}
          max={100}
          value={Math.round(ambientVolume * 100)}
          onChange={handleVolumeChange}
          label="Volume"
          accentColor={accentColor}
          formatValue={v => `${v}%`}
        />
      )}
    </div>
  );
}
