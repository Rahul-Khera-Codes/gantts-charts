import type { ProjectPriority, ProjectStatus } from '../types';

const statusColors: Record<ProjectStatus, string> = {
  'Not Started': '#9ca3af',
  'In Progress': '#3b82f6',
};

const priorityColors: Record<ProjectPriority, string> = {
  High: '#f97316',
  Medium: '#22c55e',
  Low: '#60a5fa',
};

interface StatusIndicatorProps {
  label: ProjectStatus | ProjectPriority;
  variant: 'status' | 'priority';
}

export default function StatusIndicator({ label, variant }: StatusIndicatorProps) {
  const color =
    variant === 'status'
      ? statusColors[label as ProjectStatus]
      : priorityColors[label as ProjectPriority];

  return (
    <span className="rv-status-indicator">
      <span className="rv-status-dot" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </span>
  );
}
