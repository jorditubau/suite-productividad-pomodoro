import { useState } from 'react';
import { Trash2, BrainCircuit, Coffee, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStatsStore } from '../../store/statsStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatTimestamp, formatDuration } from '../../utils/timeFormat';

const modeConfig: Record<string, { label: string; Icon: LucideIcon; color: string }> = {
  focus: { label: 'Focus', Icon: BrainCircuit, color: 'text-red-400' },
  shortBreak: { label: 'Short Break', Icon: Coffee, color: 'text-blue-400' },
  longBreak: { label: 'Long Break', Icon: Moon, color: 'text-purple-400' },
};

export function SessionLog() {
  const { sessions, clearHistory } = useStatsStore();
  const [clearOpen, setClearOpen] = useState(false);

  const recent = sessions.slice(0, 20);

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">Recent Sessions</h3>
        {sessions.length > 0 && (
          <button
            onClick={() => setClearOpen(true)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-4">No sessions yet. Start your first Pomodoro!</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {recent.map(session => {
            const cfg = modeConfig[session.mode];
            return (
              <div key={session.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className={`flex items-center gap-1.5 text-xs w-24 shrink-0 ${cfg.color}`}>
                  <cfg.Icon size={11} strokeWidth={2} />
                  {cfg.label}
                </span>
                <span className="text-sm text-gray-300 flex-1 truncate">{session.taskTitle || '—'}</span>
                <span className="text-xs text-gray-600 shrink-0">{formatDuration(Math.round(session.duration / 60))}</span>
                <span className="text-xs text-gray-600 shrink-0 w-24 text-right">{formatTimestamp(session.completedAt)}</span>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={clearHistory}
        title="Clear History"
        message="This will permanently delete all session history and stats. Are you sure?"
        confirmLabel="Clear History"
        danger
      />
    </div>
  );
}
