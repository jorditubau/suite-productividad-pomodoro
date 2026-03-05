import { useState, FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { TomatoIcon } from '../ui/TomatoIcon';
import type { Priority } from '../../types';
import { useTaskStore } from '../../store/taskStore';

const priorities: Priority[] = ['low', 'medium', 'high'];

export function TaskInput({ accentColor }: { accentColor: string }) {
  const [title, setTitle] = useState('');
  const [pomodoros, setPomodoros] = useState(1);
  const [priority, setPriority] = useState<Priority>('medium');
  const [expanded, setExpanded] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), pomodoros, priority, 'today');
    setTitle('');
    setPomodoros(1);
    setExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); if (e.target.value) setExpanded(true); }}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
          style={{ background: accentColor }}
        >
          <Plus size={16} />
        </button>
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-3 pt-1 border-t border-white/10">
          <div className="flex items-center gap-2">
            <TomatoIcon size={13} color="#9ca3af" />
            <input
              type="number"
              min={1}
              max={20}
              value={pomodoros}
              onChange={e => setPomodoros(Number(e.target.value))}
              className="w-12 bg-white/10 text-white text-xs text-center rounded-lg px-1 py-1 outline-none"
            />
          </div>

          <div className="flex gap-1">
            {priorities.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  priority === p
                    ? p === 'high' ? 'bg-red-500 text-white'
                    : p === 'medium' ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                    : 'text-gray-500 hover:text-gray-300 bg-white/5'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
