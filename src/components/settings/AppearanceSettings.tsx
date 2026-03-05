import { Moon, Sun, Monitor } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { ACCENT_COLORS } from '../../utils/colors';
import type { Theme, AccentColor } from '../../types';

const themes: { value: Theme; label: string; Icon: LucideIcon }[] = [
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
];

export function AppearanceSettings({ accentColor }: { accentColor: string }) {
  const { appSettings, updateAppSettings } = useSettingsStore();

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Theme</h3>
      <div className="flex gap-2 bg-white/5 rounded-2xl p-4">
        {themes.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => updateAppSettings({ theme: value })}
            className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              appSettings.theme === value ? 'text-white' : 'text-gray-500 hover:text-gray-300 bg-white/5'
            }`}
            style={appSettings.theme === value ? { background: accentColor } : {}}
          >
            <Icon size={20} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Accent Color</h3>
      <div className="flex gap-3 bg-white/5 rounded-2xl p-4">
        {Object.values(ACCENT_COLORS).map(color => (
          <button
            key={color.value}
            onClick={() => updateAppSettings({ accentColor: color.value as AccentColor })}
            className="flex flex-col items-center gap-2 flex-1"
            title={color.name}
          >
            <span
              className={`w-8 h-8 rounded-full transition-all ${
                appSettings.accentColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
              }`}
              style={{ background: color.ring }}
            />
            <span className="text-xs text-gray-500 text-center leading-tight">{color.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
