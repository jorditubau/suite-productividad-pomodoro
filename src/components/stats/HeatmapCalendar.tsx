import { useStatsStore } from '../../store/statsStore';
import { getLast3MonthsDates } from '../../utils/timeFormat';

function getIntensity(pomodoros: number): string {
  if (pomodoros === 0) return 'bg-white/5';
  if (pomodoros <= 2) return 'opacity-30';
  if (pomodoros <= 4) return 'opacity-60';
  if (pomodoros <= 6) return 'opacity-80';
  return 'opacity-100';
}

export function HeatmapCalendar({ accentColor }: { accentColor: string }) {
  const { dayStats } = useStatsStore();
  const dates = getLast3MonthsDates();

  // Pad to start on Sunday
  const firstDate = new Date(dates[0] + 'T12:00:00');
  const startPad = firstDate.getDay();

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Activity — Last 3 Months</h3>

      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
        {/* Day labels */}
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-gray-600 text-xs col-span-1 hidden" />
        ))}

        {/* Padding cells */}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {dates.map(date => {
          const stats = dayStats[date];
          const pomodoros = stats?.pomodoros || 0;
          const intensity = getIntensity(pomodoros);
          const d = new Date(date + 'T12:00:00');
          const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

          return (
            <div
              key={date}
              title={`${label}: ${pomodoros} pomodoro${pomodoros !== 1 ? 's' : ''}`}
              className={`aspect-square rounded-sm cursor-default transition-opacity ${
                pomodoros === 0 ? 'bg-white/5' : intensity
              }`}
              style={pomodoros > 0 ? { backgroundColor: accentColor } : undefined}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-xs text-gray-600">Less</span>
        {[0, 2, 4, 6, 8].map(v => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: v === 0 ? 'rgba(255,255,255,0.05)' : accentColor,
              opacity: v === 0 ? 1 : 0.2 + (v / 8) * 0.8,
            }}
          />
        ))}
        <span className="text-xs text-gray-600">More</span>
      </div>
    </div>
  );
}
