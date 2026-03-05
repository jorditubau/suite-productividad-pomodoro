import type { Priority } from '../../types';

const priorityConfig: Record<Priority, { dot: string; label: string }> = {
  low: { dot: 'bg-green-500', label: 'Low' },
  medium: { dot: 'bg-yellow-500', label: 'Med' },
  high: { dot: 'bg-red-500', label: 'High' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { dot, label } = priorityConfig[priority];
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
