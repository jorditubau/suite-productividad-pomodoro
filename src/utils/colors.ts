import type { AccentColor, AccentColorDef } from '../types';

export const ACCENT_COLORS: Record<AccentColor, AccentColorDef> = {
  tomato: {
    name: 'Tomato Red',
    value: 'tomato',
    ring: '#ef4444',
    text: 'text-red-500',
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    border: 'border-red-500',
    light: 'bg-red-500/20',
  },
  ocean: {
    name: 'Ocean Blue',
    value: 'ocean',
    ring: '#3b82f6',
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    border: 'border-blue-500',
    light: 'bg-blue-500/20',
  },
  forest: {
    name: 'Forest Green',
    value: 'forest',
    ring: '#22c55e',
    text: 'text-green-500',
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    border: 'border-green-500',
    light: 'bg-green-500/20',
  },
  purple: {
    name: 'Purple',
    value: 'purple',
    ring: '#a855f7',
    text: 'text-purple-500',
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    border: 'border-purple-500',
    light: 'bg-purple-500/20',
  },
  amber: {
    name: 'Amber',
    value: 'amber',
    ring: '#f59e0b',
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    border: 'border-amber-500',
    light: 'bg-amber-500/20',
  },
};

export function getAccentColor(color: AccentColor): AccentColorDef {
  return ACCENT_COLORS[color];
}
