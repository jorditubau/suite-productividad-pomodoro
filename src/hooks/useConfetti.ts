import { useCallback } from 'react';

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

export function useConfetti() {
  const launch = useCallback(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = Math.random() * 10 + 6;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = Math.random() * 2 + 2;
      const rotation = Math.random() * 360;

      el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        transform: rotate(${rotation}deg);
        pointer-events: none;
        z-index: 9999;
      `;

      container.appendChild(el);
      setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
    }
  }, []);

  return { launch };
}
