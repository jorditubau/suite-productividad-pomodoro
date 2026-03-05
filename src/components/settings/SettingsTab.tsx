import { useState } from 'react';
import { Timer, Palette, Volume2, HardDrive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TimerSettings } from './TimerSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SoundSettings } from './SoundSettings';
import { DataSettings } from './DataSettings';

const sections: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'timer', label: 'Timer', Icon: Timer },
  { id: 'appearance', label: 'Looks', Icon: Palette },
  { id: 'sounds', label: 'Sounds', Icon: Volume2 },
  { id: 'data', label: 'Data', Icon: HardDrive },
];

export function SettingsTab({ accentColor }: { accentColor: string }) {
  const [section, setSection] = useState('timer');

  return (
    <div className="py-4 space-y-4">
      <div className="flex bg-white/5 rounded-xl p-1 gap-1">
        {sections.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              section === id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            style={section === id ? { background: accentColor } : {}}
          >
            <Icon size={14} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {section === 'timer' && <TimerSettings accentColor={accentColor} />}
        {section === 'appearance' && <AppearanceSettings accentColor={accentColor} />}
        {section === 'sounds' && <SoundSettings accentColor={accentColor} />}
        {section === 'data' && <DataSettings accentColor={accentColor} />}
      </div>
    </div>
  );
}
