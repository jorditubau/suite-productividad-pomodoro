import { Music, Bell, Cpu, VolumeX, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { Slider } from '../ui/Slider';
import type { TimerSound } from '../../types';

const soundOptions: { value: TimerSound; label: string; Icon: LucideIcon }[] = [
  { value: 'chime', label: 'Chime', Icon: Music },
  { value: 'bell', label: 'Bell', Icon: Bell },
  { value: 'digital', label: 'Digital', Icon: Cpu },
  { value: 'none', label: 'None', Icon: VolumeX },
];

export function SoundSettings({ accentColor }: { accentColor: string }) {
  const { appSettings, updateAppSettings } = useSettingsStore();

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Timer Sound</h3>
      <div className="bg-white/5 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {soundOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => updateAppSettings({ timerSound: value })}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                appSettings.timerSound === value ? 'text-white' : 'text-gray-500 hover:text-gray-300 bg-white/5'
              }`}
              style={appSettings.timerSound === value ? { background: accentColor } : {}}
            >
              <Icon size={14} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>
        <Slider
          min={0} max={100}
          value={Math.round(appSettings.timerVolume * 100)}
          onChange={v => updateAppSettings({ timerVolume: v / 100 })}
          label="Timer Volume"
          accentColor={accentColor}
          formatValue={v => `${v}%`}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Other</h3>
      <div className="bg-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300 flex items-center gap-2">
            <Clock size={14} className="text-gray-500" />
            Tick sound every second
          </span>
          <button
            onClick={() => updateAppSettings({ tickSound: !appSettings.tickSound })}
            className="relative w-11 h-6 rounded-full transition-all duration-200"
            style={appSettings.tickSound ? { background: accentColor } : { background: 'rgba(255,255,255,0.1)' }}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${appSettings.tickSound ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
