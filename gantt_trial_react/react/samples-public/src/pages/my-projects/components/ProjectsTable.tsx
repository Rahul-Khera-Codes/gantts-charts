import { useState } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { projects } from '../data/projects';
import type { Project } from '../types';
import StatusIndicator from './StatusIndicator';
import HealthPill from './HealthPill';
import UserAvatar from './UserAvatar';
import AvatarStack from './AvatarStack';
import RowActionsMenu from './RowActionsMenu';

interface ProjectsTableProps {
  onOpenEdit?: (project: Project) => void;
  onGoToGantt?: (project: Project) => void;
}

type SortDirection = 'asc' | 'desc' | null;

const columns: { key: string; label: string; sortable: boolean }[] = [
  { key: 'project', label: 'Project', sortable: true },
  { key: 'externalCode', label: 'External Code', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'health', label: 'Health', sortable: true },
  { key: 'owner', label: 'Owner', sortable: true },
  { key: 'admins', label: 'Admins', sortable: true },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') {
    return <ArrowUpwardIcon className="rv-sort-icon rv-sort-icon--active" fontSize="inherit" />;
  }
  if (direction === 'desc') {
    return <ArrowDownwardIcon className="rv-sort-icon rv-sort-icon--active" fontSize="inherit" />;
  }
  return (
    <span className="rv-sort-icon-stack">
      <KeyboardArrowUpIcon className="rv-sort-chevron" />
      <KeyboardArrowDownIcon className="rv-sort-chevron" />
    </span>
  );
}

export default function ProjectsTable({ onOpenEdit, onGoToGantt }: ProjectsTableProps) {
  const [sortKey, setSortKey] = useState<string>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
      return;
    }
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection(null);
      setSortKey('');
    } else {
      setSortDirection('asc');
    }
  };

  return (
    <div className="rv-table-wrap">
      <table className="rv-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const direction: SortDirection =
                col.sortable && sortKey === col.key ? sortDirection : null;
              return (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  className={col.sortable ? 'rv-th-sortable' : undefined}
                >
                  {col.label && (
                    <>
                      <span>{col.label}</span>
                      {col.sortable && <SortIcon direction={direction} />}
                    </>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="rv-col-project">
                <div className="rv-project-cell">
                  <span className="rv-project-flag-slot">
                    {project.flagIcon === 'flag' && (
                      <FlagIcon className="rv-project-flag" fontSize="inherit" />
                    )}
                    {project.flagIcon === 'info' && (
                      <InfoOutlinedIcon className="rv-project-info" fontSize="inherit" />
                    )}
                  </span>
                  <a
                    href="#"
                    className="rv-project-link"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenEdit?.(project);
                    }}
                  >
                    {project.name}
                  </a>
                </div>
              </td>
              <td className="rv-col-code">{project.externalCode}</td>
              <td>
                <StatusIndicator label={project.status} variant="status" />
              </td>
              <td>{project.category}</td>
              <td>
                <StatusIndicator label={project.priority} variant="priority" />
              </td>
              <td>
                <HealthPill health={project.health} />
              </td>
              <td>
                <div className="rv-owner-cell">
                  <UserAvatar
                    initials={project.owner.initials}
                    color={project.owner.color}
                    size="sm"
                  />
                  <span className="rv-owner-name">{project.owner.name}</span>
                </div>
              </td>
              <td>
                <AvatarStack admins={project.admins} />
              </td>
              <td>
                <div className="rv-date-cell">
                  {project.hasDateWarning && (
                    <ErrorIcon className="rv-date-warning" fontSize="inherit" />
                  )}
                  <span>{project.startDate}</span>
                </div>
              </td>
              <td className="rv-col-actions">
                <RowActionsMenu onGoToGantt={() => onGoToGantt?.(project)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
