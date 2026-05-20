import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

export default function ProjectsToolbar() {
  return (
    <div className="rv-toolbar">
      <div className="rv-toolbar-left">
        <div className="rv-search">
          <SearchIcon className="rv-search-icon" fontSize="small" />
          <input type="search" placeholder="Search" className="rv-search-input" />
        </div>
        <button type="button" className="rv-filter-btn" aria-label="Filter">
          <FilterListIcon fontSize="small" />
        </button>
      </div>
      <button type="button" className="rv-new-project-btn">
        <AddIcon fontSize="small" />
        <span>New Project</span>
      </button>
    </div>
  );
}
