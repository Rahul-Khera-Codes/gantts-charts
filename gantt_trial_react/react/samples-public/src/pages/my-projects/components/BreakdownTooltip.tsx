import { createPortal } from 'react-dom';
import FlagIcon from '@mui/icons-material/Flag';
import PushPinIcon from '@mui/icons-material/PushPin';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import type {
  BreakdownItem,
  BreakdownItemType,
  BreakdownStatus,
  ProjectHealth,
} from '../types';
import UserAvatar from './UserAvatar';
import AvatarStack from './AvatarStack';

const TYPE_LABEL: Record<BreakdownItemType, string> = {
  project: 'PROJECT',
  stage: 'STAGE',
  milestone: 'MILESTONE',
  'work-package': 'WORK PACKAGE',
  task: 'TASK',
};

function TypeIcon({ type }: { type: BreakdownItemType }) {
  switch (type) {
    case 'project':
      return <FolderOpenIcon className="rv-bd-tt-icon rv-bd-tt-icon--project" fontSize="small" />;
    case 'stage':
      return <PersonOutlineIcon className="rv-bd-tt-icon rv-bd-tt-icon--stage" fontSize="small" />;
    case 'milestone':
      return <OutlinedFlagIcon className="rv-bd-tt-icon rv-bd-tt-icon--milestone" fontSize="small" />;
    case 'work-package':
      return <Inventory2OutlinedIcon className="rv-bd-tt-icon rv-bd-tt-icon--wp" fontSize="small" />;
    case 'task':
      return <PlaylistAddCheckIcon className="rv-bd-tt-icon rv-bd-tt-icon--task" fontSize="small" />;
  }
}

const STATUS_STYLE: Record<BreakdownStatus, { bg: string; color: string; dot: string }> = {
  'In Progress': { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  'Not Started': { bg: '#f3f4f6', color: '#4b5563', dot: '#9ca3af' },
  'On Hold': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  Cancelled: { bg: '#f3f4f6', color: '#6b7280', dot: '#d1d5db' },
  Closed: { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  Rejected: { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  Assigned: { bg: '#dbeafe', color: '#1e40af', dot: '#93c5fd' },
  Unassigned: { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' },
  'Pending Approval': { bg: '#ffffff', color: '#6b7280', dot: '#d1d5db' },
  Blocked: { bg: '#fee2e2', color: '#991b1b', dot: '#dc2626' },
};

const HEALTH_STYLE: Record<ProjectHealth, { bg: string; color: string }> = {
  'No Data': { bg: '#f3f4f6', color: '#6b7280' },
  'On Track': { bg: '#dcfce7', color: '#15803d' },
  Behind: { bg: '#ffedd5', color: '#c2410c' },
  Overburn: { bg: '#fee2e2', color: '#b91c1c' },
};

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatLongDate(d: Date): string {
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function StatusPill({ status }: { status: BreakdownStatus }) {
  const style = STATUS_STYLE[status];
  return (
    <span className="rv-bd-tt-pill" style={{ background: style.bg, color: style.color }}>
      <span className="rv-bd-tt-dot" style={{ background: style.dot }} />
      {status}
    </span>
  );
}

function HealthPill({ health }: { health: ProjectHealth }) {
  const style = HEALTH_STYLE[health];
  return (
    <span className="rv-bd-tt-pill" style={{ background: style.bg, color: style.color }}>
      {health}
    </span>
  );
}

interface BreakdownTooltipProps {
  item: BreakdownItem;
  left: number;
  top: number;
  placement: 'above' | 'below';
  onEnter: () => void;
  onLeave: () => void;
}

export default function BreakdownTooltip({
  item,
  left,
  top,
  placement,
  onEnter,
  onLeave,
}: BreakdownTooltipProps) {
  const start = new Date(item.startDate);
  const end = new Date(item.endDate);
  const duration = daysBetween(start, end);

  return createPortal(
    <div
      className={`rv-bd-tt rv-bd-tt--${item.type} rv-bd-tt--${placement}`}
      style={{ left, top }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="rv-bd-tt-label">
        <TypeIcon type={item.type} />
        <span>{TYPE_LABEL[item.type]}</span>
      </div>
      <div className="rv-bd-tt-name">{item.name}</div>

      {item.type === 'project' && (
        <>
          <div className="rv-bd-tt-chips">
            {item.flagIcon === 'flag' && (
              <FlagIcon className="rv-bd-tt-flag" fontSize="small" />
            )}
            {item.status && <StatusPill status={item.status} />}
            {item.health && <HealthPill health={item.health} />}
          </div>
          <dl className="rv-bd-tt-meta">
            {item.category && (
              <div>
                <dt>Category:</dt>
                <dd>{item.category}</dd>
              </div>
            )}
            {item.priority && (
              <div>
                <dt>Priority:</dt>
                <dd>{item.priority}</dd>
              </div>
            )}
            <div>
              <dt>Duration:</dt>
              <dd>{duration} days</dd>
            </div>
          </dl>
          {item.owner && (
            <div className="rv-bd-tt-row">
              <span className="rv-bd-tt-row-label">Owner:</span>
              <UserAvatar
                initials={item.owner.initials}
                color={item.owner.color}
                size="sm"
              />
              <span className="rv-bd-tt-owner-name">{item.owner.name}</span>
            </div>
          )}
          {item.assignees && (
            <div className="rv-bd-tt-row">
              <span className="rv-bd-tt-row-label">Assignee(s):</span>
              <AvatarStack admins={item.assignees} />
            </div>
          )}
        </>
      )}

      {item.type === 'stage' && (
        <dl className="rv-bd-tt-meta">
          {item.stageSet && (
            <div>
              <dt>Stage Set:</dt>
              <dd>{item.stageSet}</dd>
            </div>
          )}
          <div>
            <dt>Duration:</dt>
            <dd>{duration} days</dd>
          </div>
        </dl>
      )}

      {item.type === 'milestone' && (
        <>
          {item.status && (
            <div className="rv-bd-tt-chips">
              <StatusPill status={item.status} />
            </div>
          )}
          <dl className="rv-bd-tt-meta">
            <div>
              <dt>Due Date:</dt>
              <dd>{formatLongDate(end)}</dd>
            </div>
          </dl>
        </>
      )}

      {item.type === 'work-package' && (
        <>
          <div className="rv-bd-tt-chips">
            {item.status && <StatusPill status={item.status} />}
            {item.health && <HealthPill health={item.health} />}
          </div>
          <dl className="rv-bd-tt-meta">
            {item.category && (
              <div>
                <dt>Category:</dt>
                <dd>{item.category}</dd>
              </div>
            )}
            {item.priority && (
              <div>
                <dt>Priority:</dt>
                <dd>{item.priority}</dd>
              </div>
            )}
            <div>
              <dt>Duration:</dt>
              <dd>{duration} days</dd>
            </div>
          </dl>
          {item.owner && (
            <div className="rv-bd-tt-row">
              <span className="rv-bd-tt-row-label">Owner:</span>
              <UserAvatar
                initials={item.owner.initials}
                color={item.owner.color}
                size="sm"
              />
              <span className="rv-bd-tt-owner-name">{item.owner.name}</span>
            </div>
          )}
          {item.assignees && (
            <div className="rv-bd-tt-row">
              <span className="rv-bd-tt-row-label">Assignee(s):</span>
              <AvatarStack admins={item.assignees} />
            </div>
          )}
        </>
      )}

      {item.type === 'task' && (
        <>
          <div className="rv-bd-tt-chips">
            {item.flagIcon === 'pin' && (
              <PushPinIcon className="rv-bd-tt-pin" fontSize="small" />
            )}
            {item.status && <StatusPill status={item.status} />}
            {item.health && <HealthPill health={item.health} />}
          </div>
          <dl className="rv-bd-tt-meta">
            {item.category && (
              <div>
                <dt>Category:</dt>
                <dd>{item.category}</dd>
              </div>
            )}
            {item.priority && (
              <div>
                <dt>Priority:</dt>
                <dd>{item.priority}</dd>
              </div>
            )}
            <div>
              <dt>Duration:</dt>
              <dd>{duration} days</dd>
            </div>
            {item.estimate && (
              <div>
                <dt>Estimate:</dt>
                <dd>{item.estimate}</dd>
              </div>
            )}
            {item.actual && (
              <div>
                <dt>Actual:</dt>
                <dd>{item.actual}</dd>
              </div>
            )}
          </dl>
          {item.owner && (
            <div className="rv-bd-tt-row">
              <span className="rv-bd-tt-row-label">Assignee:</span>
              <UserAvatar
                initials={item.owner.initials}
                color={item.owner.color}
                size="sm"
              />
              <span className="rv-bd-tt-owner-name">{item.owner.name}</span>
            </div>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
