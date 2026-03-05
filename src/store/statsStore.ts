import { create } from 'zustand';
import type { Session, DayStats } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { getDateKey } from '../utils/timeFormat';

interface StatsState {
  sessions: Session[];
  dayStats: Record<string, DayStats>;
  addSession: (session: Omit<Session, 'id'>) => void;
  clearHistory: () => void;
  getStreak: () => number;
  getTodayPomodoros: () => number;
  getTodayFocusMinutes: () => number;
  getWeekTasksCompleted: () => number;
}

function saveSessions(sessions: Session[]) {
  saveToStorage(STORAGE_KEYS.sessions, sessions);
}

function saveDayStats(dayStats: Record<string, DayStats>) {
  saveToStorage(STORAGE_KEYS.dayStats, dayStats);
}

export const useStatsStore = create<StatsState>((set, get) => ({
  sessions: loadFromStorage<Session[]>(STORAGE_KEYS.sessions, []),
  dayStats: loadFromStorage<Record<string, DayStats>>(STORAGE_KEYS.dayStats, {}),

  addSession: (sessionData) => {
    const session: Session = { ...sessionData, id: crypto.randomUUID() };
    const dateKey = getDateKey(new Date(session.completedAt));
    const durationMinutes = Math.round(session.duration / 60);

    set((state) => {
      const sessions = [session, ...state.sessions].slice(0, 500);
      saveSessions(sessions);

      const existing = state.dayStats[dateKey] || { date: dateKey, pomodoros: 0, focusMinutes: 0 };
      const dayStats = {
        ...state.dayStats,
        [dateKey]: {
          ...existing,
          pomodoros: session.mode === 'focus' ? existing.pomodoros + 1 : existing.pomodoros,
          focusMinutes: session.mode === 'focus' ? existing.focusMinutes + durationMinutes : existing.focusMinutes,
        },
      };
      saveDayStats(dayStats);
      return { sessions, dayStats };
    });
  },

  clearHistory: () => {
    saveSessions([]);
    saveDayStats({});
    set({ sessions: [], dayStats: {} });
  },

  getStreak: () => {
    const { dayStats } = get();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      if (dayStats[key] && dayStats[key].pomodoros > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  getTodayPomodoros: () => {
    const { dayStats } = get();
    const today = getDateKey();
    return dayStats[today]?.pomodoros || 0;
  },

  getTodayFocusMinutes: () => {
    const { dayStats } = get();
    const today = getDateKey();
    return dayStats[today]?.focusMinutes || 0;
  },

  getWeekTasksCompleted: () => {
    const { sessions } = get();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const tasksThisWeek = new Set<string>();
    sessions.forEach(s => {
      if (s.completedAt >= weekAgo && s.taskId) {
        tasksThisWeek.add(s.taskId);
      }
    });
    return tasksThisWeek.size;
  },
}));
