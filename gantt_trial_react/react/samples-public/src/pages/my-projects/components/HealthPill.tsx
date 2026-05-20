import type { ProjectHealth } from '../types';

const healthStyles: Record<ProjectHealth, { bg: string; color: string }> = {
  'No Data': { bg: '#f3f4f6', color: '#6b7280' },
  'On Track': { bg: '#dcfce7', color: '#15803d' },
  Behind: { bg: '#ffedd5', color: '#c2410c' },
  Overburn: { bg: '#fee2e2', color: '#b91c1c' },
};

interface HealthPillProps {
  health: ProjectHealth;
}

export default function HealthPill({ health }: HealthPillProps) {
  const style = healthStyles[health];
  return (
    <span
      className="rv-health-pill"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {health}
    </span>
  );
}
