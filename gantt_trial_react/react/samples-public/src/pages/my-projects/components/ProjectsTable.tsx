import FlagIcon from '@mui/icons-material/Flag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { projects } from '../data/projects';
import StatusIndicator from './StatusIndicator';
import HealthPill from './HealthPill';
import UserAvatar from './UserAvatar';
import AvatarStack from './AvatarStack';
import RowActionsMenu from './RowActionsMenu';

const columns: { label: string; sortable: boolean }[] = [
  { label: 'Project', sortable: true },
  { label: 'External Code', sortable: true },
  { label: 'Status', sortable: true },
  { label: 'Category', sortable: true },
  { label: 'Priority', sortable: true },
  { label: 'Health', sortable: true },
  { label: 'Owner', sortable: true },
  { label: 'Admins', sortable: true },
  { label: 'Start Date', sortable: true },
  { label: '', sortable: false },
];

export default function ProjectsTable() {
  return (
    <div className="rv-table-wrap">
      <table className="rv-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.label || 'actions'}>
                {col.label && (
                  <>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <UnfoldMoreIcon className="rv-sort-icon" fontSize="inherit" />
                    )}
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id}>
              <td className="rv-col-project">
                <div className="rv-project-cell">
                  {project.flagIcon === 'flag' && (
                    <FlagIcon className="rv-project-flag" fontSize="inherit" />
                  )}
                  {project.flagIcon === 'info' && (
                    <InfoOutlinedIcon className="rv-project-info" fontSize="inherit" />
                  )}
                  <a href="#" className="rv-project-link" onClick={(e) => e.preventDefault()}>
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
                <UserAvatar
                  initials={project.owner.initials}
                  color={project.owner.color}
                  size="sm"
                />
              </td>
              <td>
                <AvatarStack admins={project.admins} />
              </td>
              <td>
                <div className="rv-date-cell">
                  <span>{project.startDate}</span>
                  {project.hasDateWarning && (
                    <ErrorOutlineIcon className="rv-date-warning" fontSize="inherit" />
                  )}
                </div>
              </td>
              <td className="rv-col-actions">
                <RowActionsMenu defaultOpen={index === 0} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
