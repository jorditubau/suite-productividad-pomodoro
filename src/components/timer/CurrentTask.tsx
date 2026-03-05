import { Target } from 'lucide-react';
import { TomatoIcon } from '../ui/TomatoIcon';
import { useTaskStore } from '../../store/taskStore';

interface Props {
  onGoToTasks: () => void;
}

export function CurrentTask({ onGoToTasks }: Props) {
  const { tasks, activeTaskId } = useTaskStore();
  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <button
      onClick={onGoToTasks}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm max-w-xs"
    >
      <Target size={14} className="text-gray-400 shrink-0" />
      <span className="truncate text-gray-300">
        {activeTask ? activeTask.title : 'No task selected — click to pick one'}
      </span>
      {activeTask && (
        <span className="shrink-0 text-gray-500 text-xs flex items-center gap-1">
          <TomatoIcon size={11} color="currentColor" />
          {activeTask.completedPomodoros}/{activeTask.estimatedPomodoros}
        </span>
      )}
    </button>
  );
}
