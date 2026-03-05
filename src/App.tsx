import { useState, useCallback, useEffect } from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import { TomatoIcon } from './components/ui/TomatoIcon';
import { TimerPanel } from './components/timer/TimerTab';
import { TasksTab } from './components/tasks/TasksTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { useSettingsStore } from './store/settingsStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTimerStore } from './store/timerStore';
import { useTimer } from './hooks/useTimer';
import { getAccentColor } from './utils/colors';

function useTheme() {
  const { appSettings } = useSettingsStore();
  useEffect(() => {
    const root = document.documentElement;
    const applyDark = () => root.classList.add('dark');
    const applyLight = () => root.classList.remove('dark');

    if (appSettings.theme === 'dark') {
      applyDark();
    } else if (appSettings.theme === 'light') {
      applyLight();
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) applyDark(); else applyLight();
      const handler = (e: MediaQueryListEvent) => e.matches ? applyDark() : applyLight();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [appSettings.theme]);
}

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const { appSettings } = useSettingsStore();
  const timerState = useTimerStore();
  const { togglePlay, reset } = useTimer();
  const accent = getAccentColor(appSettings.accentColor);

  useTheme();

  useKeyboardShortcuts({ onPlayPause: togglePlay, onReset: reset });

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[9999]" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2">
          {showSettings ? (
            <button
              onClick={() => setShowSettings(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium text-sm">Back</span>
            </button>
          ) : (
            <>
              <TomatoIcon size={22} color={accent.ring} />
              <span className="font-bold text-lg tracking-tight">FocusFlow</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!showSettings && timerState.isRunning && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/10">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent.ring }} />
              Running
            </div>
          )}
          {showSettings ? (
            <h1 className="font-semibold text-white">Settings</h1>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              title="Settings"
            >
              <Settings size={17} />
            </button>
          )}
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      {showSettings ? (
        /* Settings — full width */
        <main className="flex-1 min-h-0 overflow-y-auto px-5 max-w-lg mx-auto w-full">
          <SettingsTab accentColor={accent.ring} />
        </main>
      ) : (
        /* Main dashboard — two floating cards */
        <main className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center px-8 pb-12 pt-4">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">

            {/* Left — Timer */}
            <div className="lg:w-[460px] lg:shrink-0 bg-white/[0.05] rounded-3xl overflow-hidden shadow-[3px_4px_14px_rgba(0,0,0,0.4)]">
              <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
                <TimerPanel />
              </div>
            </div>

            {/* Right — Tasks */}
            <div className="flex-1 bg-white/[0.05] rounded-3xl overflow-hidden shadow-[3px_4px_14px_rgba(0,0,0,0.4)]">
              <div className="overflow-y-auto max-h-[calc(100vh-140px)] px-6 py-5">
                <TasksTab accentColor={accent.ring} />
              </div>
            </div>

          </div>
        </main>
      )}
    </div>
  );
}
