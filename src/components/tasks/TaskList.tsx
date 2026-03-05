import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Trash2, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useTaskStore } from '../../store/taskStore';

export function TaskList({ accentColor }: { accentColor: string }) {
  const { tasks, reorderTasks, clearCompleted } = useTaskStore();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    reorderTasks(arrayMove(tasks, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {activeTasks.map(task => (
              <TaskCard key={task.id} task={task} accentColor={accentColor} />
            ))}
          </div>
        </SortableContext>

        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompletedExpanded(!completedExpanded)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors flex-1"
              >
                {completedExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <CheckCircle2 size={12} />
                Completed
                <span className="ml-1 normal-case font-normal tracking-normal">{completedTasks.length}</span>
              </button>
              <button
                onClick={() => setClearDialogOpen(true)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>

            {completedExpanded && (
              <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TaskCard key={task.id} task={task} accentColor={accentColor} />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={clearCompleted}
        title="Clear Completed"
        message="This will permanently delete all completed tasks. Are you sure?"
        confirmLabel="Clear All"
        danger
      />
    </DndContext>
  );
}
