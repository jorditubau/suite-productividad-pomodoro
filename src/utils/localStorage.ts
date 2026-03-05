export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export const STORAGE_KEYS = {
  tasks: 'ff_tasks',
  timerSettings: 'ff_timerSettings',
  appSettings: 'ff_appSettings',
  activeTaskId: 'ff_activeTaskId',
};
