import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Target } from 'lucide-react';
import { PriorityBadge } from '../ui/Badge';
import { TomatoIcon } from '../ui/TomatoIcon';
import { useTaskStore } from '../../store/taskStore';
import { useConfetti } from '../../hooks/useConfetti';
import type { Task } from '../../types';

interface Props {
  task: Task;
  accentColor: string;
}

export function TaskCard({ task, accentColor }: Props) {
  const { toggleComplete, deleteTask, setActiveTask, activeTaskId } = useTaskStore();
  const { launch } = useConfetti();
  const [deleting, setDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isActive = activeTaskId === task.id;

  const handleToggle = () => {
    if (!task.completed) launch();
    toggleComplete(task.id);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => deleteTask(task.id), 200);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor: isActive ? accentColor + '60' : undefined,
        backgroundColor: isActive ? accentColor + '10' : undefined,
      }}
      className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
        task.completed ? 'opacity-60' : ''
      } ${
        isActive ? 'border-opacity-50' : 'border-white/5 bg-white/5 hover:bg-white/8'
      } ${deleting ? 'scale-95 opacity-0' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical size={14} />
      </button>

      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
          task.completed ? 'border-transparent' : 'border-gray-600 hover:border-gray-400'
        }`}
        style={task.completed ? { background: accentColor, borderColor: accentColor } : {}}
      >
        {task.completed && (
          <svg viewBox="0 0 10 10" className="w-3 h-3 text-white" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-all truncate ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <PriorityBadge priority={task.priority} />
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <TomatoIcon size={11} color="currentColor" />
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setActiveTask(isActive ? null : task.id)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-xs ${
            isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
          style={isActive ? { background: accentColor } : {}}
          title={isActive ? 'Deselect' : 'Set as active'}
        >
          <Target size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
