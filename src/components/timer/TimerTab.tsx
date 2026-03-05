import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTimer } from '../../hooks/useTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TimerRing } from './TimerRing';
import { TimerControls } from './TimerControls';
import { ModeSelector } from './ModeSelector';
import { AmbientSounds } from './AmbientSounds';
import { CurrentTask } from './CurrentTask';
import { getAccentColor } from '../../utils/colors';

export function TimerPanel() {
  const timer = useTimerStore();
  const { appSettings, timerSettings } = useSettingsStore();
  const { togglePlay, reset, skip, switchMode } = useTimer();
  const accent = getAccentColor(appSettings.accentColor);

  useKeyboardShortcuts({ onPlayPause: togglePlay, onReset: reset });
  const sessionInCycle = (timer.pomodoroCount % timerSettings.longBreakInterval) + 1;

  return (
    <div className="flex flex-col items-center gap-5 py-6 w-full">
      <ModeSelector mode={timer.mode} onSelect={switchMode} accentColor={accent.ring} />

      <TimerRing
        mode={timer.mode}
        secondsLeft={timer.secondsLeft}
        totalSeconds={timer.totalSeconds}
        accentColor={accent.ring}
      />

      <div className="text-sm text-gray-500 font-medium text-center">
        Session {Math.min(sessionInCycle, timerSettings.longBreakInterval)} of {timerSettings.longBreakInterval}
        {' · '}
        <span className="text-gray-400">{timer.pomodoroCount} today</span>
      </div>

      <TimerControls
        isRunning={timer.isRunning}
        onPlayPause={togglePlay}
        onReset={reset}
        onSkip={skip}
        accentColor={accent.ring}
      />

      <CurrentTask />

      <div className="w-full px-4 pb-4">
        <AmbientSounds accentColor={accent.ring} />
      </div>
    </div>
  );
}
