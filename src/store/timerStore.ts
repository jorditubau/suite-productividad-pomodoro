import { create } from 'zustand';
import type { TimerMode } from '../types';

interface TimerState {
  mode: TimerMode;
  isRunning: boolean;
  secondsLeft: number;
  totalSeconds: number;
  pomodoroCount: number;
  sessionCount: number;
  dnMode: boolean;
  activeAmbient: string | null;
  ambientVolume: number;
  setMode: (mode: TimerMode, duration: number) => void;
  setRunning: (v: boolean) => void;
  tick: () => void;
  reset: (duration: number) => void;
  incrementPomodoro: () => void;
  setDnMode: (v: boolean) => void;
  setActiveAmbient: (v: string | null) => void;
  setAmbientVolume: (v: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  mode: 'focus',
  isRunning: false,
  secondsLeft: 25 * 60,
  totalSeconds: 25 * 60,
  pomodoroCount: 0,
  sessionCount: 0,
  dnMode: false,
  activeAmbient: null,
  ambientVolume: 0.5,

  setMode: (mode, duration) => set({
    mode,
    isRunning: false,
    secondsLeft: duration * 60,
    totalSeconds: duration * 60,
  }),

  setRunning: (v) => set({ isRunning: v }),

  tick: () => set((state) => ({
    secondsLeft: Math.max(0, state.secondsLeft - 1),
  })),

  reset: (duration) => set({
    isRunning: false,
    secondsLeft: duration * 60,
    totalSeconds: duration * 60,
  }),

  incrementPomodoro: () => set((state) => ({
    pomodoroCount: state.pomodoroCount + 1,
    sessionCount: state.sessionCount + 1,
  })),

  setDnMode: (v) => set({ dnMode: v }),
  setActiveAmbient: (v) => set({ activeAmbient: v }),
  setAmbientVolume: (v) => set({ ambientVolume: v }),
}));
