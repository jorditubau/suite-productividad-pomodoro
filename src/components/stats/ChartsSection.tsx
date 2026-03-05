import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useStatsStore } from '../../store/statsStore';
import { getWeekDates, getLast4WeeksDates } from '../../utils/timeFormat';

const CHART_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#f9fafb',
  fontSize: '12px',
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function ChartsSection({ accentColor }: { accentColor: string }) {
  const { dayStats, sessions } = useStatsStore();

  const weekData = getWeekDates().map(date => {
    const stats = dayStats[date] || { pomodoros: 0, focusMinutes: 0 };
    const d = new Date(date + 'T12:00:00');
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    return { label, pomodoros: stats.pomodoros, minutes: stats.focusMinutes };
  });

  const last4Weeks = getLast4WeeksDates().map(date => {
    const stats = dayStats[date] || { focusMinutes: 0 };
    const d = new Date(date + 'T12:00:00');
    const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return { label, hours: Math.round((stats.focusMinutes / 60) * 10) / 10 };
  }).filter((_, i) => i % 3 === 0); // sample every 3rd day for readability

  // Task time distribution (pie chart)
  const taskMap: Record<string, number> = {};
  sessions.filter(s => s.mode === 'focus' && s.taskTitle).forEach(s => {
    const title = s.taskTitle!;
    taskMap[title] = (taskMap[title] || 0) + s.duration;
  });
  const pieData = Object.entries(taskMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, seconds]) => ({ name, value: Math.round(seconds / 60) }));

  return (
    <div className="space-y-4">
      <ChartCard title="Pomodoros — Last 7 Days">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="pomodoros" fill={accentColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Focus Hours — Last 4 Weeks">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={last4Weeks} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke={accentColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: accentColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {pieData.length > 0 && (
        <ChartCard title="Time per Task (Top 5)">
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width="50%" height={140}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} min`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-gray-400 truncate flex-1">{entry.name}</span>
                  <span className="text-gray-500 shrink-0">{entry.value}m</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
