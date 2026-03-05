import { STORAGE_KEYS } from './localStorage';

export function exportAllData(): void {
  const data: Record<string, unknown> = {};
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
    }
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (data[key] !== undefined) {
        localStorage.setItem(storageKey, JSON.stringify(data[key]));
      }
    });
    return true;
  } catch {
    return false;
  }
}

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
