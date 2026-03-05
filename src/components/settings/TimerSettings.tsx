import { BrainCircuit, Coffee, Moon, Repeat } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTimerStore } from '../../store/timerStore';
import { Slider } from '../ui/Slider';

export function TimerSettings({ accentColor }: { accentColor: string }) {
  const { timerSettings, updateTimerSettings } = useSettingsStore();
  const { setMode, mode } = useTimerStore();

  const handleFocusChange = (v: number) => {
    updateTimerSettings({ focusDuration: v });
    if (mode === 'focus') setMode('focus', v);
  };

  const handleShortBreakChange = (v: number) => {
    updateTimerSettings({ shortBreakDuration: v });
    if (mode === 'shortBreak') setMode('shortBreak', v);
  };

  const handleLongBreakChange = (v: number) => {
    updateTimerSettings({ longBreakDuration: v });
    if (mode === 'longBreak') setMode('longBreak', v);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Timer Durations</h3>

      <div className="space-y-5 bg-white/5 rounded-2xl p-4">
        <SliderWithIcon
          Icon={BrainCircuit}
          label="Focus"
          min={5} max={60}
          value={timerSettings.focusDuration}
          onChange={handleFocusChange}
          accentColor={accentColor}
        />
        <SliderWithIcon
          Icon={Coffee}
          label="Short Break"
          min={1} max={15}
          value={timerSettings.shortBreakDuration}
          onChange={handleShortBreakChange}
          accentColor={accentColor}
        />
        <SliderWithIcon
          Icon={Moon}
          label="Long Break"
          min={5} max={30}
          value={timerSettings.longBreakDuration}
          onChange={handleLongBreakChange}
          accentColor={accentColor}
        />
        <SliderWithIcon
          Icon={Repeat}
          label="Long break every N sessions"
          min={2} max={8}
          value={timerSettings.longBreakInterval}
          onChange={v => updateTimerSettings({ longBreakInterval: v })}
          accentColor={accentColor}
          formatValue={v => `${v} sessions`}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Auto-start</h3>
      <div className="bg-white/5 rounded-2xl p-4 space-y-3">
        <Toggle
          label="Auto-start breaks"
          checked={timerSettings.autoStartBreaks}
          onChange={v => updateTimerSettings({ autoStartBreaks: v })}
          accentColor={accentColor}
        />
        <Toggle
          label="Auto-start focus after break"
          checked={timerSettings.autoStartFocus}
          onChange={v => updateTimerSettings({ autoStartFocus: v })}
          accentColor={accentColor}
        />
      </div>
    </div>
  );
}

function SliderWithIcon({ Icon, label, min, max, value, onChange, accentColor, formatValue }: {
  Icon: React.ElementType; label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; accentColor: string; formatValue?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 flex items-center gap-2">
          <Icon size={14} className="text-gray-500" strokeWidth={1.8} />
          {label}
        </span>
        <span className="text-gray-400 font-mono tabular-nums text-xs">
          {formatValue ? formatValue(value) : `${value} min`}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10">
        <div className="absolute left-0 top-0 h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: accentColor }} />
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange, accentColor }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; accentColor: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-all duration-200"
        style={checked ? { background: accentColor } : { background: 'rgba(255,255,255,0.1)' }}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
