import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import LevelSelect, { type Level } from './LevelSelect';
import type { ProjectsView } from '../types';

interface ProjectsToolbarProps {
  activeView: ProjectsView;
  level?: Level;
  onLevelChange?: (level: Level) => void;
}

export default function ProjectsToolbar({ activeView, level, onLevelChange }: ProjectsToolbarProps) {
  return (
    <div className="rv-toolbar">
      <div className="rv-search">
        <SearchIcon className="rv-search-icon" fontSize="small" />
        <input type="search" placeholder="Search" className="rv-search-input" />
      </div>

      {activeView === 'gantt' && (
        <LevelSelect value={level} onChange={onLevelChange} />
      )}

      <button type="button" className="rv-filter-btn" aria-label="Filter">
        <FilterListIcon fontSize="small" />
      </button>
      <button type="button" className="rv-new-project-btn">
        <AddIcon fontSize="small" />
        <span>New Project</span>
      </button>
    </div>
  );
}
