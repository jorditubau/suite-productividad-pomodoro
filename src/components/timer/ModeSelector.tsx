import { BrainCircuit, Coffee, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TimerMode } from '../../types';

interface Props {
  mode: TimerMode;
  onSelect: (mode: TimerMode) => void;
  accentColor: string;
}

const modes: { value: TimerMode; label: string; Icon: LucideIcon }[] = [
  { value: 'focus', label: 'Focus', Icon: BrainCircuit },
  { value: 'shortBreak', label: 'Short Break', Icon: Coffee },
  { value: 'longBreak', label: 'Long Break', Icon: Moon },
];

export function ModeSelector({ mode, onSelect, accentColor }: Props) {
  return (
    <div className="flex rounded-xl bg-white/5 p-1 gap-1">
      {modes.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === value ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
          style={mode === value ? { background: accentColor } : {}}
        >
          <Icon size={14} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>
  );
}
