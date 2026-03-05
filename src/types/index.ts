export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type Priority = 'low' | 'medium' | 'high';
export type TaskGroup = 'today' | 'week' | 'someday';
export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'tomato' | 'ocean' | 'forest' | 'purple' | 'amber';
export type TimerSound = 'chime' | 'bell' | 'digital' | 'none';

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

export interface TimerSettings {
  focusDuration: number;
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
