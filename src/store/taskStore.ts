import { create } from 'zustand';
import type { Task, Priority, TaskGroup } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';

interface TaskState {
  tasks: Task[];
  activeTaskId: string | null;
  addTask: (title: string, estimatedPomodoros: number, priority: Priority, group: TaskGroup) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  setActiveTask: (id: string | null) => void;
  incrementTaskPomodoro: (id: string) => void;
  clearCompleted: () => void;
}

function save(tasks: Task[]) {
  saveToStorage(STORAGE_KEYS.tasks, tasks);
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: loadFromStorage<Task[]>(STORAGE_KEYS.tasks, []),
  activeTaskId: loadFromStorage<string | null>(STORAGE_KEYS.activeTaskId, null),

  addTask: (title, estimatedPomodoros, priority, group) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      priority,
      group,
      completed: false,
      createdAt: Date.now(),
    };
    set((state) => {
      const tasks = [task, ...state.tasks];
      save(tasks);
      return { tasks };
    });
    return task;
  },

  updateTask: (id, patch) => set((state) => {
    const tasks = state.tasks.map(t => t.id === id ? { ...t, ...patch } : t);
    save(tasks);
    return { tasks };
  }),

  deleteTask: (id) => set((state) => {
    const tasks = state.tasks.filter(t => t.id !== id);
    save(tasks);
    const activeTaskId = state.activeTaskId === id ? null : state.activeTaskId;
    if (activeTaskId !== state.activeTaskId) {
      saveToStorage(STORAGE_KEYS.activeTaskId, activeTaskId);
    }
    return { tasks, activeTaskId };
  }),

  toggleComplete: (id) => set((state) => {
    const tasks = state.tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
        : t
    );
    save(tasks);
    return { tasks };
  }),

  reorderTasks: (tasks) => {
    save(tasks);
    set({ tasks });
  },

  setActiveTask: (id) => {
    saveToStorage(STORAGE_KEYS.activeTaskId, id);
    set({ activeTaskId: id });
  },

  incrementTaskPomodoro: (id) => set((state) => {
    const tasks = state.tasks.map(t =>
      t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
    );
    save(tasks);
    return { tasks };
  }),

  clearCompleted: () => set((state) => {
    const tasks = state.tasks.filter(t => !t.completed);
    save(tasks);
    return { tasks };
  }),
}));
