import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types';

interface Props {
  title: string;
  Icon: LucideIcon;
  tasks: Task[];
  accentColor: string;
}

export function TaskGroup({ title, Icon, tasks, accentColor }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (tasks.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider w-full hover:text-gray-300 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
        <Icon size={12} />
        {title}
        <span className="ml-auto normal-case font-normal tracking-normal text-gray-600">{tasks.length}</span>
      </button>

      {!collapsed && (
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} accentColor={accentColor} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
