import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';

export function TasksTab({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-4 py-4">
      <TaskInput accentColor={accentColor} />
      <TaskList accentColor={accentColor} />
    </div>
  );
}
