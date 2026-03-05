import { Maximize2, Minimize2 } from 'lucide-react';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTimer } from '../../hooks/useTimer';
import { TimerRing } from './TimerRing';
import { TimerControls } from './TimerControls';
import { ModeSelector } from './ModeSelector';
import { AmbientSounds } from './AmbientSounds';
import { CurrentTask } from './CurrentTask';
import { getAccentColor } from '../../utils/colors';
import type { Tab } from '../../types';

interface Props {
  onGoToTasks: () => void;
  onTabChange: (tab: Tab) => void;
}

export function TimerTab({ onGoToTasks }: Props) {
  const timer = useTimerStore();
  const { appSettings, timerSettings } = useSettingsStore();
  const { togglePlay, reset, skip, switchMode } = useTimer();
  const accent = getAccentColor(appSettings.accentColor);
  const pomodorosInCycle = ((timer.pomodoroCount) % timerSettings.longBreakInterval) + (timer.isRunning && timer.mode === 'focus' ? 0 : 0);
  const sessionInCycle = (timer.pomodoroCount % timerSettings.longBreakInterval) + 1;

  if (timer.dnMode) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center gap-8 z-40">
        <TimerRing
          mode={timer.mode}
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          accentColor={accent.ring}
        />
        <TimerControls
          isRunning={timer.isRunning}
          onPlayPause={togglePlay}
          onReset={reset}
          onSkip={skip}
          accentColor={accent.ring}
        />
        <button
          onClick={() => timer.setDnMode(false)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <Minimize2 size={16} /> Exit Focus Mode
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 max-w-sm mx-auto">
      <ModeSelector mode={timer.mode} onSelect={switchMode} accentColor={accent.ring} />

      <div className="relative">
        <TimerRing
          mode={timer.mode}
          secondsLeft={timer.secondsLeft}
          totalSeconds={timer.totalSeconds}
          accentColor={accent.ring}
        />
        <button
          onClick={() => timer.setDnMode(true)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-300 transition-colors"
          title="Do Not Disturb mode"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="text-sm text-gray-500 font-medium">
        Session {Math.min(sessionInCycle, timerSettings.longBreakInterval)} of {timerSettings.longBreakInterval}
        {' · '}
        <span className="text-gray-400">{timer.pomodoroCount} total today</span>
      </div>

      <TimerControls
        isRunning={timer.isRunning}
        onPlayPause={togglePlay}
        onReset={reset}
        onSkip={skip}
        accentColor={accent.ring}
      />

      <CurrentTask onGoToTasks={onGoToTasks} />

      <div className="w-full">
        <AmbientSounds accentColor={accent.ring} />
      </div>
    </div>
  );
}
