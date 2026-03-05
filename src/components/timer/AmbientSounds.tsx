import { useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Coffee, TreePine, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';

// We'll use Web Audio API to generate ambient-like sounds since no files are bundled
// In production, replace these with actual Howler.js instances pointing to audio files

const AMBIENT_OPTIONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'rain', label: 'Rain', Icon: CloudRain },
  { id: 'coffee', label: 'Café', Icon: Coffee },
  { id: 'forest', label: 'Forest', Icon: TreePine },
  { id: 'ocean', label: 'Ocean', Icon: Waves },
];

// Simple pink/white noise generator using Web Audio API
class AmbientGenerator {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;

  start(type: string, volume: number) {
    this.stop();
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate noise based on type
      if (type === 'rain') {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.4;
        }
      } else if (type === 'ocean') {
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.0555702;
          b1 = 0.99 * b1 + white * 0.0750759;
          b2 = 0.99 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.1;
        }
      } else if (type === 'forest') {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }
      } else {
        // coffee shop — general ambient hum
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.25;
        }
      }

      this.source = this.ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = volume;

      this.source.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.source.start();
    } catch { /* ignore */ }
  }

  setVolume(v: number) {
    if (this.gainNode) this.gainNode.gain.value = v;
  }

  stop() {
    try {
      this.source?.stop();
      this.ctx?.close();
    } catch { /* ignore */ }
    this.source = null;
    this.gainNode = null;
    this.ctx = null;
  }
}

const ambient = new AmbientGenerator();

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
