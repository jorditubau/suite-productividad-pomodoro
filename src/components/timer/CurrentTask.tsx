import { Target } from 'lucide-react';
import { TomatoIcon } from '../ui/TomatoIcon';
import { useTaskStore } from '../../store/taskStore';

export function CurrentTask() {
  const { tasks, activeTaskId } = useTaskStore();
  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm max-w-xs w-full justify-center">
      <Target size={14} className="text-gray-400 shrink-0" />
      <span className="truncate text-gray-300">
        {activeTask ? activeTask.title : 'No task selected'}
      </span>
      {activeTask && (
        <span className="shrink-0 text-gray-500 text-xs flex items-center gap-1">
          <TomatoIcon size={11} color="currentColor" />
          {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros}
        </span>
      )}
    </div>
  );
}
