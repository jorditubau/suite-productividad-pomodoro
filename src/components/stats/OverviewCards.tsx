import { Flame, Clock, CheckSquare, Target } from 'lucide-react';
import { useStatsStore } from '../../store/statsStore';
import { formatDuration } from '../../utils/timeFormat';

export function OverviewCards({ accentColor }: { accentColor: string }) {
  const { getTodayPomodoros, getTodayFocusMinutes, getWeekTasksCompleted, getStreak } = useStatsStore();

  const cards = [
    {
      icon: Clock,
      label: 'Focus Time Today',
      value: formatDuration(getTodayFocusMinutes()),
      sub: 'minutes',
    },
    {
      icon: Target,
      label: 'Pomodoros Today',
      value: getTodayPomodoros(),
      sub: 'sessions',
    },
    {
      icon: CheckSquare,
      label: 'Tasks This Week',
      value: getWeekTasksCompleted(),
      sub: 'completed',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: getStreak(),
      sub: 'days',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="bg-white/5 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon size={13} style={{ color: accentColor }} />
            {label}
          </div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-gray-600">{sub}</div>
        </div>
      ))}
    </div>
  );
}
