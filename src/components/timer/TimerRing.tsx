import { ProgressRing } from '../ui/ProgressRing';
import { formatTime } from '../../utils/timeFormat';
import type { TimerMode } from '../../types';

const modeColors: Record<TimerMode, string> = {
  focus: '#ef4444',
  shortBreak: '#3b82f6',
  longBreak: '#a855f7',
};

interface Props {
  mode: TimerMode;
  secondsLeft: number;
  totalSeconds: number;
  accentColor: string;
}

export function TimerRing({ mode, secondsLeft, totalSeconds, accentColor }: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const ringColor = mode === 'focus' ? accentColor : modeColors[mode];

  return (
    <div className="relative flex items-center justify-center">
      <ProgressRing
        radius={140}
        progress={progress}
        strokeWidth={10}
        color={ringColor}
        trailColor="rgba(255,255,255,0.07)"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold text-6xl text-white tracking-tight tabular-nums leading-none">
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  );
}
