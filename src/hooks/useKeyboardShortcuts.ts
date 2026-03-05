import { useEffect } from 'react';
import type { Tab } from '../types';

interface Options {
  onPlayPause: () => void;
  onReset: () => void;
  onTabChange: (tab: Tab) => void;
}

export function useKeyboardShortcuts({ onPlayPause, onReset, onTabChange }: Options) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't fire shortcuts in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case 'r':
        case 'R':
          onReset();
          break;
        case 't':
        case 'T':
          onTabChange('tasks');
          break;
        case 's':
        case 'S':
          onTabChange('stats');
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPlayPause, onReset, onTabChange]);
}
