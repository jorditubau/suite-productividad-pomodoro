import { useState, useCallback, useEffect } from 'react';
import { Timer, CheckSquare, Settings } from 'lucide-react';
import { TomatoIcon } from './components/ui/TomatoIcon';
import { TimerTab } from './components/timer/TimerTab';
import { TasksTab } from './components/tasks/TasksTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { useSettingsStore } from './store/settingsStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTimerStore } from './store/timerStore';
import { useTimer } from './hooks/useTimer';
import { getAccentColor } from './utils/colors';
import type { Tab } from './types';

const tabs: { id: Tab; label: string; Icon: typeof Timer }[] = [
  { id: 'timer', label: 'Timer', Icon: Timer },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

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
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const { appSettings } = useSettingsStore();
  const timerState = useTimerStore();
  const { togglePlay, reset } = useTimer();
  const accent = getAccentColor(appSettings.accentColor);

  useTheme();

  const handleTabChange = useCallback((tab: Tab) => setActiveTab(tab), []);

  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onReset: reset,
    onTabChange: handleTabChange,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[9999]" />

      <header className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <TomatoIcon size={24} color={accent.ring} />
          <span className="font-bold text-lg tracking-tight">FocusFlow</span>
        </div>
        {timerState.isRunning && (
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/10">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent.ring }} />
            Running
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-20">
        {activeTab === 'timer' && (
          <TimerTab onGoToTasks={() => setActiveTab('tasks')} onTabChange={handleTabChange} />
        )}
        {activeTab === 'tasks' && <TasksTab accentColor={accent.ring} />}
        {activeTab === 'settings' && <SettingsTab accentColor={accent.ring} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-md border-t border-white/5 px-2 py-2 flex">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={isActive ? { color: accent.ring } : {}}
              />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
