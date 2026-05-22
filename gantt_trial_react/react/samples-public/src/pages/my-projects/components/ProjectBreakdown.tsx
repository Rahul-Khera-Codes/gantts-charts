import { useMemo, useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { projectBreakdown } from '../data/breakdown';
import type { BreakdownItem, BreakdownItemType } from '../types';
import BreakdownTooltip from './BreakdownTooltip';
import LevelSelect from './LevelSelect';
import userAvatar from '../../../assets/76523b16af64de64bfd8e4730147a4492ab87212.png';

const TOOLTIP_HEIGHT_ESTIMATE = 360;
const TOOLTIP_WIDTH = 260;
const TOOLTIP_VIEWPORT_MARGIN = 12;
const HOVER_CLOSE_DELAY = 200;

const DAY_WIDTH = 60;
const ROW_HEIGHT = 50;
const WINDOW_START = new Date('2026-05-17');
const WINDOW_DAYS = 10;
const TODAY = new Date('2026-05-24');
const MONTH_LABEL = 'May 2026';
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MILESTONE_BBOX = 22;
const MILESTONE_OFFSET_LEFT = 12;
const MILESTONE_VISUAL_HALF = (MILESTONE_BBOX / 2) * Math.SQRT2;
const CONNECTOR_STUB = 12;
const CONNECTOR_RADIUS = 6;
const CONNECTOR_TARGET_GAP = 4;

const TYPE_FILTERS = ['Stages', 'Milestones', 'Work Packages', 'Tasks'] as const;

const FILTER_TO_TYPE: Record<(typeof TYPE_FILTERS)[number], BreakdownItemType> = {
  Stages: 'stage',
  Milestones: 'milestone',
  'Work Packages': 'work-package',
  Tasks: 'task',
};

interface FlatRow {
  item: BreakdownItem;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

const days = Array.from({ length: WINDOW_DAYS }, (_, i) => {
  const d = new Date(WINDOW_START);
  d.setDate(d.getDate() + i);
  return d;
});

const todayOffset = daysBetween(WINDOW_START, TODAY) * DAY_WIDTH;
const timelineWidth = WINDOW_DAYS * DAY_WIDTH;

function flatten(
  item: BreakdownItem,
  depth: number,
  expanded: Set<string>,
  out: FlatRow[],
) {
  const hasChildren = !!item.children && item.children.length > 0;
  const isExpanded = expanded.has(item.id);
  out.push({ item, depth, hasChildren, expanded: isExpanded });
  if (hasChildren && isExpanded) {
    item.children!.forEach((c) => flatten(c, depth + 1, expanded, out));
  }
}

function flattenAll(item: BreakdownItem, out: BreakdownItem[]) {
  out.push(item);
  if (item.children) item.children.forEach((c) => flattenAll(c, out));
}

function collectAllIds(item: BreakdownItem, out: string[]) {
  if (item.children && item.children.length > 0) {
    out.push(item.id);
    item.children.forEach((c) => collectAllIds(c, out));
  }
}

function TypeIcon({ type }: { type: BreakdownItemType }) {
  switch (type) {
    case 'project':
      return <FolderOpenIcon className="rv-bd-icon rv-bd-icon--project" fontSize="small" />;
    case 'stage':
      return <PersonOutlineIcon className="rv-bd-icon rv-bd-icon--stage" fontSize="small" />;
    case 'milestone':
      return <OutlinedFlagIcon className="rv-bd-icon rv-bd-icon--milestone" fontSize="small" />;
    case 'work-package':
      return (
        <Inventory2OutlinedIcon className="rv-bd-icon rv-bd-icon--wp" fontSize="small" />
      );
    case 'task':
      return <PlaylistAddCheckIcon className="rv-bd-icon rv-bd-icon--task" fontSize="small" />;
  }
}

interface Anchor {
  sourceX: number;
  targetX: number;
  y: number;
}

function buildConnectorPath(s: Anchor, t: Anchor): string {
  const sx = s.sourceX;
  const sy = s.y;
  const tx = t.targetX - CONNECTOR_TARGET_GAP;
  const ty = t.y;

  if (sy === ty) {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }

  const midX = Math.max(sx + CONNECTOR_STUB, tx - CONNECTOR_STUB);
  const vDir = ty > sy ? 1 : -1;
  const r = Math.min(CONNECTOR_RADIUS, Math.abs(ty - sy) / 2, Math.abs(midX - sx), Math.abs(tx - midX));

  return [
    `M ${sx} ${sy}`,
    `L ${midX - r} ${sy}`,
    `Q ${midX} ${sy} ${midX} ${sy + r * vDir}`,
    `L ${midX} ${ty - r * vDir}`,
    `Q ${midX} ${ty} ${midX + r} ${ty}`,
    `L ${tx} ${ty}`,
  ].join(' ');
}

function formatShort(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(-2);
  return `${day} ${month} '${year}`;
}

interface ProjectBreakdownProps {
  projectName: string;
  onBack: () => void;
}

export default function ProjectBreakdown({ projectName, onBack }: ProjectBreakdownProps) {
  const allCollapsibleIds = useMemo(() => {
    const ids: string[] = [];
    collectAllIds(projectBreakdown, ids);
    return ids;
  }, []);

  const [expanded, setExpanded] = useState<Set<string>>(new Set(allCollapsibleIds));
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<{
    item: BreakdownItem;
    left: number;
    top: number;
    placement: 'above' | 'below';
  } | null>(null);
  const closeTimerRef = useRef<number | null>(null);

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

  const showTooltip = (item: BreakdownItem, e: React.MouseEvent<HTMLDivElement>) => {
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
      item,
      left: clampedLeft,
      top: placement === 'above' ? rect.top : rect.bottom,
      placement,
    });
  };

  const flatRows = useMemo(() => {
    if (activeFilters.size === 0) {
      const out: FlatRow[] = [];
      flatten(projectBreakdown, 0, expanded, out);
      return out;
    }
    const allowedTypes = new Set<BreakdownItemType>();
    activeFilters.forEach((f) => {
      const type = FILTER_TO_TYPE[f as (typeof TYPE_FILTERS)[number]];
      if (type) allowedTypes.add(type);
    });
    const items: BreakdownItem[] = [];
    flattenAll(projectBreakdown, items);
    return items
      .filter((item) => allowedTypes.has(item.type))
      .map<FlatRow>((item) => ({
        item,
        depth: 0,
        hasChildren: false,
        expanded: false,
      }));
  }, [expanded, activeFilters]);

  const anchors = useMemo(() => {
    const map = new Map<string, Anchor>();
    flatRows.forEach(({ item }, rowIndex) => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const leftDays = daysBetween(WINDOW_START, start);
      const spanDays = daysBetween(start, end);
      const left = leftDays * DAY_WIDTH;
      const width = spanDays * DAY_WIDTH;
      const clampedLeft = Math.max(0, left);
      const clampedWidth = Math.max(
        0,
        Math.min(width + Math.min(left, 0), timelineWidth - clampedLeft),
      );
      const y = rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;

      if (item.type === 'milestone') {
        const centerX = clampedLeft + clampedWidth - MILESTONE_OFFSET_LEFT + MILESTONE_BBOX / 2;
        map.set(item.id, {
          sourceX: centerX + MILESTONE_VISUAL_HALF,
          targetX: centerX - MILESTONE_VISUAL_HALF,
          y,
        });
      } else {
        map.set(item.id, {
          sourceX: clampedLeft + clampedWidth,
          targetX: clampedLeft,
          y,
        });
      }
    });
    return map;
  }, [flatRows]);

  const connectors = useMemo(() => {
    const out: { key: string; d: string }[] = [];
    flatRows.forEach(({ item }) => {
      if (!item.dependsOn) return;
      const target = anchors.get(item.id);
      if (!target) return;
      item.dependsOn.forEach((fromId) => {
        const source = anchors.get(fromId);
        if (!source) return;
        out.push({
          key: `${fromId}->${item.id}`,
          d: buildConnectorPath(source, target),
        });
      });
    });
    return out;
  }, [flatRows, anchors]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(allCollapsibleIds));
  const collapseAll = () => setExpanded(new Set());

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  return (
    <main className="rv-main">
      <header className="rv-bd-header">
        <h1 className="rv-bd-title">
          <button type="button" className="rv-bd-crumb" onClick={onBack}>
            My Projects
          </button>
          <span className="rv-bd-sep">/</span>
          <span className="rv-bd-current">{projectName}</span>
        </h1>
        <div className="rv-page-header-actions">
          <button type="button" className="rv-icon-btn" aria-label="Notifications">
            <NotificationsNoneOutlinedIcon />
          </button>
          <div className="rv-user-avatar">
            <img src={userAvatar} alt="User profile" className="rv-user-avatar-img" />
          </div>
        </div>
      </header>

      <div className="rv-toolbar rv-bd-toolbar">
        <div className="rv-search">
          <SearchIcon className="rv-search-icon" fontSize="small" />
          <input type="search" placeholder="Search" className="rv-search-input" />
        </div>
        <LevelSelect />
      </div>

      <div className="rv-bd-filter-row">
        <div className="rv-bd-filter-left">
          <FilterAltOutlinedIcon className="rv-bd-filter-icon" fontSize="small" />
          {TYPE_FILTERS.map((f) => {
            const isActive = activeFilters.has(f);
            return (
              <button
                key={f}
                type="button"
                className={`rv-bd-chip${isActive ? ' rv-bd-chip--active' : ''}`}
                onClick={() => toggleFilter(f)}
              >
                <span>{f}</span>
                {isActive && (
                  <CancelIcon
                    className="rv-bd-chip-clear"
                    fontSize="inherit"
                  />
                )}
              </button>
            );
          })}
          {activeFilters.size > 0 && (
            <button
              type="button"
              className="rv-bd-clear-all"
              onClick={() => setActiveFilters(new Set())}
            >
              Clear All
            </button>
          )}
        </div>
        <div className="rv-bd-filter-right">
          <button type="button" className="rv-bd-tool-btn" onClick={expandAll}>
            <UnfoldMoreIcon fontSize="small" />
            <span>Expand All</span>
          </button>
          <button type="button" className="rv-bd-tool-btn" onClick={collapseAll}>
            <UnfoldLessIcon fontSize="small" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      <div className="rv-bd-wrap">
        <div className="rv-bd-left">
          <table className="rv-bd-table">
            <thead>
              <tr>
                <th className="rv-bd-col-name">
                  <span>Work Items</span>
                  <span className="rv-sort-icon-stack">
                    <KeyboardArrowUpIcon className="rv-sort-chevron" />
                    <KeyboardArrowDownIcon className="rv-sort-chevron" />
                  </span>
                </th>
                <th>
                  <span>Start Date</span>
                  <span className="rv-sort-icon-stack">
                    <KeyboardArrowUpIcon className="rv-sort-chevron" />
                    <KeyboardArrowDownIcon className="rv-sort-chevron" />
                  </span>
                </th>
                <th>
                  <span>End Date</span>
                  <span className="rv-sort-icon-stack">
                    <KeyboardArrowUpIcon className="rv-sort-chevron" />
                    <KeyboardArrowDownIcon className="rv-sort-chevron" />
                  </span>
                </th>
                <th>
                  <span>Duration</span>
                  <span className="rv-sort-icon-stack">
                    <KeyboardArrowUpIcon className="rv-sort-chevron" />
                    <KeyboardArrowDownIcon className="rv-sort-chevron" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {flatRows.map(({ item, depth, hasChildren, expanded: isExpanded }) => {
                const start = new Date(item.startDate);
                const end = new Date(item.endDate);
                const duration = daysBetween(start, end);
                return (
                  <tr key={item.id}>
                    <td className="rv-bd-col-name">
                      <span
                        className="rv-bd-name-inner"
                        style={{ paddingLeft: depth * 20 }}
                      >
                        {hasChildren ? (
                          <button
                            type="button"
                            className="rv-bd-chevron-btn"
                            onClick={() => toggleExpanded(item.id)}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? (
                              <KeyboardArrowDownIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowRightIcon fontSize="small" />
                            )}
                          </button>
                        ) : (
                          <span className="rv-bd-chevron-placeholder" />
                        )}
                        <TypeIcon type={item.type} />
                        <span className="rv-bd-name-text">{item.name}</span>
                      </span>
                    </td>
                    <td>{formatShort(start)}</td>
                    <td>{formatShort(end)}</td>
                    <td>{duration} days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rv-bd-right">
          <div className="rv-bd-timeline" style={{ width: timelineWidth }}>
            <div className="rv-gantt-month">{MONTH_LABEL}</div>
            <div className="rv-gantt-day-header">
              {days.map((d) => (
                <div
                  key={d.toISOString()}
                  className="rv-gantt-day-cell"
                  style={{ width: DAY_WIDTH }}
                >
                  <div className="rv-gantt-day-num">{d.getDate()}</div>
                  <div className="rv-gantt-day-name">{DAY_NAMES[d.getDay()]}</div>
                </div>
              ))}
            </div>

            <div className="rv-bd-body">
              {flatRows.map(({ item }) => {
                const start = new Date(item.startDate);
                const end = new Date(item.endDate);
                const leftDays = daysBetween(WINDOW_START, start);
                const spanDays = daysBetween(start, end);
                const left = leftDays * DAY_WIDTH;
                const width = spanDays * DAY_WIDTH;
                const clampedLeft = Math.max(0, left);
                const clampedWidth = Math.max(
                  0,
                  Math.min(width + Math.min(left, 0), timelineWidth - clampedLeft),
                );
                const progress = item.progress ?? 0;
                const showPct = progress > 0;

                return (
                  <div key={item.id} className="rv-bd-row">
                    {days.map((d) => (
                      <div
                        key={d.toISOString()}
                        className="rv-gantt-row-cell"
                        style={{ width: DAY_WIDTH }}
                      />
                    ))}
                    {item.type === 'milestone' ? (
                      <div
                        className="rv-bd-milestone"
                        style={{ left: clampedLeft + clampedWidth - 12 }}
                        onMouseEnter={(e) => showTooltip(item, e)}
                        onMouseLeave={scheduleClose}
                      />
                    ) : (
                      clampedWidth > 0 && (
                        <div
                          className={`rv-bd-bar rv-bd-bar--${item.type}`}
                          style={{ left: clampedLeft, width: clampedWidth }}
                          onMouseEnter={(e) => showTooltip(item, e)}
                          onMouseLeave={scheduleClose}
                        >
                          <div
                            className="rv-bd-bar-progress"
                            style={{ width: `${progress * 100}%` }}
                          />
                          {showPct && (
                            <span
                              className="rv-bd-bar-pct"
                              style={{ left: `${progress * 100}%` }}
                            >
                              {Math.round(progress * 100)}%
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                );
              })}

              {connectors.length > 0 && (
                <svg
                  className="rv-bd-connectors"
                  width={timelineWidth}
                  height={flatRows.length * ROW_HEIGHT}
                >
                  <defs>
                    <marker
                      id="rv-bd-arrow"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                    </marker>
                  </defs>
                  {connectors.map(({ key, d }) => (
                    <path
                      key={key}
                      d={d}
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      fill="none"
                      markerEnd="url(#rv-bd-arrow)"
                    />
                  ))}
                </svg>
              )}

              <div className="rv-gantt-today-line" style={{ left: todayOffset }}>
                <span className="rv-gantt-today-pill">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hovered && (
        <BreakdownTooltip
          item={hovered.item}
          left={hovered.left}
          top={hovered.top}
          placement={hovered.placement}
          onEnter={cancelClose}
          onLeave={scheduleClose}
        />
      )}
    </main>
  );
}
