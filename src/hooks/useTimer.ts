import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTaskStore } from '../store/taskStore';
import { useStatsStore } from '../store/statsStore';
import { useNotifications } from './useNotifications';
import { formatTime } from '../utils/timeFormat';
import type { TimerMode } from '../types';

// Web Audio API chime generator
function playChime(volume: number, type: string) {
  if (type === 'none') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const frequencies = type === 'digital'
      ? [880, 1760]
      : type === 'bell'
      ? [523.25, 659.25, 783.99]
      : [523.25, 659.25, 783.99, 1046.5]; // chime

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type === 'digital' ? 'square' : 'sine';
      const startTime = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(volume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });

    setTimeout(() => ctx.close(), 3000);
  } catch { /* ignore */ }
}

function playTick(volume: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1200;
    osc.type = 'sine';
    gain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
    setTimeout(() => ctx.close(), 500);
  } catch { /* ignore */ }
}

export function useTimer() {
  const timer = useTimerStore();
  const { timerSettings, appSettings } = useSettingsStore();
  const { activeTaskId, tasks, incrementTaskPomodoro } = useTaskStore();
  const { addSession } = useStatsStore();
  const { notify, requestPermission } = useNotifications();
  const sessionStartRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  const getDuration = useCallback((mode: TimerMode) => {
    switch (mode) {
      case 'focus': return timerSettings.focusDuration;
      case 'shortBreak': return timerSettings.shortBreakDuration;
      case 'longBreak': return timerSettings.longBreakDuration;
    }
  }, [timerSettings]);

  const handleSessionComplete = useCallback(() => {
    const activeTask = tasks.find(t => t.id === activeTaskId);
    const duration = getDuration(timer.mode) * 60;

    addSession({
      taskId: activeTaskId || undefined,
      taskTitle: activeTask?.title,
      duration,
      mode: timer.mode,
      completedAt: Date.now(),
    });

    if (timer.mode === 'focus') {
      if (activeTaskId) incrementTaskPomodoro(activeTaskId);
      timer.incrementPomodoro();

      const modeLabel = timer.pomodoroCount > 0 && (timer.pomodoroCount + 1) % timerSettings.longBreakInterval === 0
        ? 'longBreak' : 'shortBreak';

      notify('Focus session complete! 🍅', `Time for a ${modeLabel === 'longBreak' ? 'long' : 'short'} break.`);

      const nextMode: TimerMode = modeLabel;
      const nextDuration = getDuration(nextMode);
      timer.setMode(nextMode, nextDuration);

      if (timerSettings.autoStartBreaks) {
        setTimeout(() => timer.setRunning(true), 500);
      }
    } else {
      notify('Break over!', 'Ready to focus again?');
      timer.setMode('focus', timerSettings.focusDuration);

      if (timerSettings.autoStartFocus) {
        setTimeout(() => timer.setRunning(true), 500);
      }
    }

    playChime(appSettings.timerVolume, appSettings.timerSound);
  }, [timer, timerSettings, activeTaskId, tasks, addSession, incrementTaskPomodoro, notify, getDuration, appSettings]);

  // Interval ticker
  useEffect(() => {
    if (timer.isRunning) {
      sessionStartRef.current = Date.now() - ((timer.totalSeconds - timer.secondsLeft) * 1000);
      intervalRef.current = window.setInterval(() => {
        if (timer.secondsLeft <= 1) {
          timer.tick();
          timer.setRunning(false);
          handleSessionComplete();
        } else {
          timer.tick();
          if (appSettings.tickSound) {
            playTick(appSettings.timerVolume);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isRunning, timer.secondsLeft]);

  // Update document title
  useEffect(() => {
    const modePrefix = timer.mode === 'focus' ? '▶' : timer.mode === 'shortBreak' ? '◎' : '◑';
    document.title = timer.isRunning
      ? `${modePrefix} ${formatTime(timer.secondsLeft)} — FocusFlow`
      : 'FocusFlow';
  }, [timer.secondsLeft, timer.isRunning, timer.mode]);

  const togglePlay = useCallback(() => {
    if (!timer.isRunning) {
      requestPermission();
    }
    timer.setRunning(!timer.isRunning);
  }, [timer, requestPermission]);

  const reset = useCallback(() => {
    timer.reset(getDuration(timer.mode));
  }, [timer, getDuration]);

  const skip = useCallback(() => {
    timer.setRunning(false);
    handleSessionComplete();
  }, [timer, handleSessionComplete]);

  const switchMode = useCallback((mode: TimerMode) => {
    timer.setMode(mode, getDuration(mode));
  }, [timer, getDuration]);

  return { togglePlay, reset, skip, switchMode };
}
