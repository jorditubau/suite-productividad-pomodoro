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
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPlayPause, onReset, onTabChange]);
}
