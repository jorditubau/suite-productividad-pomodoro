export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type Tab = 'timer' | 'tasks' | 'stats' | 'settings';
export type Priority = 'low' | 'medium' | 'high';
export type TaskGroup = 'today' | 'week' | 'someday';
export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'tomato' | 'ocean' | 'forest' | 'purple' | 'amber';
export type TimerSound = 'chime' | 'bell' | 'digital' | 'none';
export type AmbientSound = 'rain' | 'coffee' | 'forest' | 'ocean' | 'none';

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: Priority;
  group: TaskGroup;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface Session {
  id: string;
  taskId?: string;
  taskTitle?: string;
  duration: number; // seconds
  mode: TimerMode;
  completedAt: number;
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  pomodoros: number;
  focusMinutes: number;
}

export interface TimerSettings {
  focusDuration: number;   // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
}

export interface AppSettings {
  theme: Theme;
  accentColor: AccentColor;
  timerSound: TimerSound;
  timerVolume: number;
  ambientVolume: number;
  tickSound: boolean;
  notificationsEnabled: boolean;
}

export interface AccentColorDef {
  name: string;
  value: AccentColor;
  ring: string;
  text: string;
  bg: string;
  bgHover: string;
  border: string;
  light: string;
}
