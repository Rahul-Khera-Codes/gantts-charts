import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FlagIcon from '@mui/icons-material/Flag';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { projects } from '../data/projects';
import type { Project } from '../types';
import type { Level } from './LevelSelect';
import UserAvatar from './UserAvatar';
import AvatarStack from './AvatarStack';

const TODAY = new Date('2026-05-24');
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TOOLTIP_HEIGHT_ESTIMATE = 360;
const TOOLTIP_WIDTH = 240;
const TOOLTIP_VIEWPORT_MARGIN = 12;
const HOVER_CLOSE_DELAY = 200;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function formatShort(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(-2);
  return `${day} ${month} '${year}`;
}

function weekOfYearSundayStart(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / MS_PER_DAY);
  const firstDay = start.getDay();
  return Math.ceil((days + firstDay + 1) / 7);
}

interface Column {
  key: string;
  label1: string;
  label2?: string;
}

interface Group {
  key: string;
  label: string;
  span: number;
}

interface LevelConfig {
  columnWidth: number;
  pixelsPerDay: number;
  windowStart: Date;
  columns: Column[];
  groups: Group[];
}

function buildLevelConfig(level: Level): LevelConfig {
  if (level === 'Daily') {
    const windowStart = new Date('2026-05-17');
    const units = 10;
    const columns: Column[] = [];
    for (let i = 0; i < units; i++) {
      const d = new Date(windowStart);
      d.setDate(d.getDate() + i);
      columns.push({
        key: d.toISOString(),
        label1: String(d.getDate()),
        label2: DAY_NAMES[d.getDay()],
      });
    }
    return {
      columnWidth: 60,
      pixelsPerDay: 60,
      windowStart,
      columns,
      groups: [
        {
          key: 'g0',
          label: windowStart.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          span: units,
        },
      ],
    };
  }

  if (level === 'Weekly') {
    const windowStart = new Date('2026-05-10');
    const units = 10;
    const columnWidth = 70;
    const columns: Column[] = [];
    const groups: Group[] = [];
    let cur: Group | null = null;
    for (let i = 0; i < units; i++) {
      const d = new Date(windowStart);
      d.setDate(d.getDate() + i * 7);
      columns.push({ key: `w-${i}`, label1: `W${weekOfYearSundayStart(d)}` });

      const mid = new Date(d);
      mid.setDate(mid.getDate() + 3);
      const label = mid.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (cur && cur.label === label) cur.span++;
      else {
        cur = { key: `g${i}`, label, span: 1 };
        groups.push(cur);
      }
    }
    return {
      columnWidth,
      pixelsPerDay: columnWidth / 7,
      windowStart,
      columns,
      groups,
    };
  }

  if (level === 'Monthly') {
    const windowStart = new Date('2026-05-01');
    const units = 10;
    const columnWidth = 110;
    const columns: Column[] = [];
    const groups: Group[] = [];
    let cur: Group | null = null;
    for (let i = 0; i < units; i++) {
      const d = new Date(windowStart);
      d.setMonth(d.getMonth() + i);
      columns.push({ key: `m-${i}`, label1: d.toLocaleString('en-US', { month: 'short' }) });

      const label = String(d.getFullYear());
      if (cur && cur.label === label) cur.span++;
      else {
        cur = { key: `g${i}`, label, span: 1 };
        groups.push(cur);
      }
    }
    return {
      columnWidth,
      pixelsPerDay: columnWidth / 30.4,
      windowStart,
      columns,
      groups,
    };
  }

  // Yearly — anchor today's year in the middle
  const todayYear = TODAY.getFullYear();
  const windowStart = new Date(todayYear - 1, 0, 1);
  const units = 3;
  const columnWidth = 230;
  const columns: Column[] = [];
  for (let i = 0; i < units; i++) {
    columns.push({ key: `y-${i}`, label1: String(todayYear - 1 + i) });
  }
  return {
    columnWidth,
    pixelsPerDay: columnWidth / 365,
    windowStart,
    columns,
    groups: [],
  };
}

function SortChevrons() {
  return (
    <span className="rv-sort-icon-stack">
      <KeyboardArrowUpIcon className="rv-sort-chevron" />
      <KeyboardArrowDownIcon className="rv-sort-chevron" />
    </span>
  );
}

const statusBg: Record<string, string> = {
  'In Progress': '#dbeafe',
  'Not Started': '#f3f4f6',
};

const statusDotColor: Record<string, string> = {
  'In Progress': '#3b82f6',
  'Not Started': '#9ca3af',
};

const healthBg: Record<string, { bg: string; color: string }> = {
  'No Data': { bg: '#f3f4f6', color: '#6b7280' },
  'On Track': { bg: '#dcfce7', color: '#15803d' },
  Behind: { bg: '#ffedd5', color: '#c2410c' },
  Overburn: { bg: '#fee2e2', color: '#b91c1c' },
};

function ProjectTooltip({
  project,
  left,
  top,
  placement,
  onEnter,
  onLeave,
  onOpenBreakdown,
}: {
  project: Project;
  left: number;
  top: number;
  placement: 'above' | 'below';
  onEnter: () => void;
  onLeave: () => void;
  onOpenBreakdown: () => void;
}) {
  const start = new Date(project.ganttStart ?? '');
  const end = new Date(project.ganttEnd ?? '');
  const duration = daysBetween(start, end);
  const status = statusBg[project.status] ?? '#f3f4f6';
  const dot = statusDotColor[project.status] ?? '#9ca3af';
  const health = healthBg[project.health];

  return createPortal(
    <div
      className={`rv-gantt-tooltip rv-gantt-tooltip--${placement}`}
      style={{ left, top }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="rv-gantt-tooltip-label">
        <FolderOpenIcon className="rv-gantt-tooltip-folder" fontSize="small" />
        <span>PROJECT</span>
      </div>
      <div className="rv-gantt-tooltip-name">{project.name.replace('...', '')}</div>

      <div className="rv-gantt-tooltip-chips">
        {project.flagIcon === 'flag' && (
          <FlagIcon className="rv-gantt-tooltip-flag" fontSize="small" />
        )}
        <span className="rv-gantt-tooltip-pill" style={{ background: status }}>
          <span className="rv-gantt-tooltip-dot" style={{ background: dot }} />
          {project.status}
        </span>
        <span
          className="rv-gantt-tooltip-pill"
          style={{ background: health.bg, color: health.color }}
        >
          {project.health}
        </span>
      </div>

      <dl className="rv-gantt-tooltip-meta">
        <div>
          <dt>Category:</dt>
          <dd>{project.category.replace('...', '')}</dd>
        </div>
        <div>
          <dt>Priority:</dt>
          <dd>{project.priority}</dd>
        </div>
        <div>
          <dt>Duration:</dt>
          <dd>{duration} days</dd>
        </div>
      </dl>

      <div className="rv-gantt-tooltip-people">
        <div className="rv-gantt-tooltip-people-row">
          <span className="rv-gantt-tooltip-people-label">Owner:</span>
          <UserAvatar
            initials={project.owner.initials}
            color={project.owner.color}
            size="sm"
          />
          <span className="rv-gantt-tooltip-owner-name">{project.owner.name}</span>
        </div>
        <div className="rv-gantt-tooltip-people-row">
          <span className="rv-gantt-tooltip-people-label">Assignee(s):</span>
          <AvatarStack admins={project.admins} />
        </div>
      </div>

      <button
        type="button"
        className="rv-gantt-tooltip-cta"
        onClick={onOpenBreakdown}
      >
        <span>Open Project Breakdown</span>
        <OpenInNewIcon fontSize="small" />
      </button>
    </div>,
    document.body,
  );
}

interface ProjectsGanttProps {
  level: Level;
  onOpenBreakdown: (project: Project) => void;
}

type DragMode = 'move' | 'resize-start' | 'resize-end';

interface DragState {
  projectId: string;
  mode: DragMode;
  startX: number;
  origStart: Date;
  origEnd: Date;
}

export default function ProjectsGantt({ level, onOpenBreakdown }: ProjectsGanttProps) {
  const [hovered, setHovered] = useState<{
    project: Project;
    left: number;
    top: number;
    placement: 'above' | 'below';
  } | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const config = useMemo(() => buildLevelConfig(level), [level]);
  const timelineWidth = config.columns.length * config.columnWidth;
  const todayOffset = daysBetween(config.windowStart, TODAY) * config.pixelsPerDay;

  const [overrides, setOverrides] = useState<Map<string, { start: Date; end: Date }>>(
    new Map(),
  );
  const [drag, setDrag] = useState<DragState | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const getDates = (p: Project) => {
    const override = overrides.get(p.id);
    if (override) return { start: override.start, end: override.end };
    return { start: new Date(p.ganttStart ?? ''), end: new Date(p.ganttEnd ?? '') };
  };

  const snapDays = (deltaPx: number) => Math.round(deltaPx / config.pixelsPerDay);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    p: Project,
    mode: DragMode,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const { start, end } = getDates(p);
    setDrag({ projectId: p.id, mode, startX: e.clientX, origStart: start, origEnd: end });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const deltaDays = snapDays(e.clientX - drag.startX);
    if (deltaDays === 0) {
      setOverrides((prev) => {
        const next = new Map(prev);
        next.set(drag.projectId, { start: drag.origStart, end: drag.origEnd });
        return next;
      });
      return;
    }
    let newStart = drag.origStart;
    let newEnd = drag.origEnd;
    if (drag.mode === 'move') {
      newStart = addDays(drag.origStart, deltaDays);
      newEnd = addDays(drag.origEnd, deltaDays);
    } else if (drag.mode === 'resize-start') {
      newStart = addDays(drag.origStart, deltaDays);
      if (daysBetween(newStart, drag.origEnd) < 1) newStart = addDays(drag.origEnd, -1);
    } else {
      newEnd = addDays(drag.origEnd, deltaDays);
      if (daysBetween(drag.origStart, newEnd) < 1) newEnd = addDays(drag.origStart, 1);
    }
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(drag.projectId, { start: newStart, end: newEnd });
      return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      setDrag(null);
    }
  };

  const scrollToToday = () => {
    if (!rightRef.current) return;
    const containerWidth = rightRef.current.clientWidth;
    rightRef.current.scrollTo({
      left: Math.max(0, todayOffset - containerWidth / 2),
      behavior: 'smooth',
    });
  };

  const cancelClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setHovered(null);
    }, HOVER_CLOSE_DELAY);
  };

  const showTooltip = (project: Project, e: React.MouseEvent<HTMLDivElement>) => {
    cancelClose();
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceAbove = rect.top;
    const placement = spaceAbove < TOOLTIP_HEIGHT_ESTIMATE ? 'below' : 'above';

    const halfWidth = TOOLTIP_WIDTH / 2;
    const minLeft = halfWidth + TOOLTIP_VIEWPORT_MARGIN;
    const maxLeft = window.innerWidth - halfWidth - TOOLTIP_VIEWPORT_MARGIN;
    const center = rect.left + rect.width / 2;
    const clampedLeft = Math.max(minLeft, Math.min(center, maxLeft));

    setHovered({
      project,
      left: clampedLeft,
      top: placement === 'above' ? rect.top : rect.bottom,
      placement,
    });
  };

  return (
    <div className="rv-gantt-wrap">
      <div className="rv-gantt-left">
        <table className="rv-gantt-table">
          <thead>
            <tr>
              <th className="rv-gantt-col-project">
                <span>Projects</span>
                <SortChevrons />
              </th>
              <th>
                <span>Start Date</span>
                <SortChevrons />
              </th>
              <th>
                <span>End Date</span>
                <SortChevrons />
              </th>
              <th>
                <span>Duration</span>
                <SortChevrons />
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const { start, end } = getDates(p);
              const duration = daysBetween(start, end);
              return (
                <tr key={p.id}>
                  <td className="rv-gantt-col-project">{p.name}</td>
                  <td>{formatShort(start)}</td>
                  <td>{formatShort(end)}</td>
                  <td>{duration} days</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rv-gantt-right" ref={rightRef}>
        <div className="rv-gantt-timeline" style={{ width: timelineWidth }}>
          <div className="rv-gantt-group-header">
            {config.groups.map((g) => (
              <div
                key={g.key}
                className="rv-gantt-group-cell"
                style={{ width: g.span * config.columnWidth }}
              >
                {g.label}
              </div>
            ))}
          </div>
          <div className="rv-gantt-day-header">
            {config.columns.map((c) => (
              <div
                key={c.key}
                className="rv-gantt-day-cell"
                style={{ width: config.columnWidth }}
              >
                <div className="rv-gantt-day-num">{c.label1}</div>
                {c.label2 && <div className="rv-gantt-day-name">{c.label2}</div>}
              </div>
            ))}
          </div>

          <div className="rv-gantt-body">
            {projects.map((p) => {
              const { start, end } = getDates(p);
              const leftDays = daysBetween(config.windowStart, start);
              const spanDays = daysBetween(start, end);
              const rawLeft = leftDays * config.pixelsPerDay;
              const rawWidth = spanDays * config.pixelsPerDay;
              const left = Math.max(0, rawLeft);
              const right = Math.min(timelineWidth, rawLeft + rawWidth);
              const width = Math.max(0, right - left);
              const progress = p.progress ?? 0;
              const showPct = progress > 0;
              const pctLabel = `${Math.round(progress * 100)}%`;
              const isDragging = drag?.projectId === p.id;

              return (
                <div key={p.id} className="rv-gantt-row">
                  {config.columns.map((c) => (
                    <div
                      key={c.key}
                      className="rv-gantt-row-cell"
                      style={{ width: config.columnWidth }}
                    />
                  ))}
                  {width > 0 && (
                    <div
                      className={`rv-gantt-bar${isDragging ? ' rv-gantt-bar--dragging' : ''}`}
                      style={{ left, width }}
                      onMouseEnter={(e) => showTooltip(p, e)}
                      onMouseLeave={scheduleClose}
                      onPointerDown={(e) => handlePointerDown(e, p, 'move')}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                    >
                      <div
                        className="rv-gantt-bar-progress"
                        style={{ width: `${progress * 100}%` }}
                      />
                      {showPct && (
                        <span className="rv-gantt-bar-pct" style={{ left: `${progress * 100}%` }}>
                          {pctLabel}
                        </span>
                      )}
                      <div
                        className="rv-gantt-bar-handle rv-gantt-bar-handle--start"
                        onPointerDown={(e) => handlePointerDown(e, p, 'resize-start')}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                      />
                      <div
                        className="rv-gantt-bar-handle rv-gantt-bar-handle--end"
                        onPointerDown={(e) => handlePointerDown(e, p, 'resize-end')}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <div className="rv-gantt-today-line" style={{ left: todayOffset }}>
              <button
                type="button"
                className="rv-gantt-today-pill"
                onClick={scrollToToday}
                aria-label="Scroll to today"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {hovered && (
        <ProjectTooltip
          project={hovered.project}
          left={hovered.left}
          top={hovered.top}
          placement={hovered.placement}
          onEnter={cancelClose}
          onLeave={scheduleClose}
          onOpenBreakdown={() => {
            cancelClose();
            onOpenBreakdown(hovered.project);
            setHovered(null);
          }}
        />
      )}
    </div>
  );
}
