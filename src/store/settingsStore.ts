import { create } from 'zustand';
import type { TimerSettings, AppSettings } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';

const defaultTimerSettings: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
};

const defaultAppSettings: AppSettings = {
  theme: 'dark',
  accentColor: 'tomato',
  timerSound: 'chime',
  timerVolume: 0.7,
  ambientVolume: 0.5,
  tickSound: false,
  notificationsEnabled: false,
};

interface SettingsState {
  timerSettings: TimerSettings;
  appSettings: AppSettings;
  updateTimerSettings: (patch: Partial<TimerSettings>) => void;
  updateAppSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  timerSettings: loadFromStorage(STORAGE_KEYS.timerSettings, defaultTimerSettings),
  appSettings: loadFromStorage(STORAGE_KEYS.appSettings, defaultAppSettings),

  updateTimerSettings: (patch) => set((state) => {
    const next = { ...state.timerSettings, ...patch };
    saveToStorage(STORAGE_KEYS.timerSettings, next);
    return { timerSettings: next };
  }),

  updateAppSettings: (patch) => set((state) => {
    const next = { ...state.appSettings, ...patch };
    saveToStorage(STORAGE_KEYS.appSettings, next);
    return { appSettings: next };
  }),

  resetSettings: () => {
    saveToStorage(STORAGE_KEYS.timerSettings, defaultTimerSettings);
    saveToStorage(STORAGE_KEYS.appSettings, defaultAppSettings);
    set({ timerSettings: defaultTimerSettings, appSettings: defaultAppSettings });
  },
}));
