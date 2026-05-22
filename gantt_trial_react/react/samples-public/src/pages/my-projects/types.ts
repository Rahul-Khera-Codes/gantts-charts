export type ProjectsView = 'list' | 'gantt';

export type BreakdownItemType = 'project' | 'stage' | 'milestone' | 'work-package' | 'task';

export type BreakdownStatus =
  | 'In Progress'
  | 'Not Started'
  | 'On Hold'
  | 'Cancelled'
  | 'Closed'
  | 'Rejected'
  | 'Assigned'
  | 'Unassigned'
  | 'Pending Approval'
  | 'Blocked';

export interface BreakdownItem {
  id: string;
  name: string;
  type: BreakdownItemType;
  startDate: string;
  endDate: string;
  progress?: number;
  dependsOn?: string[];
  children?: BreakdownItem[];

  status?: BreakdownStatus;
  health?: ProjectHealth;
  category?: string;
  priority?: ProjectPriority;
  owner?: { initials: string; name: string; color: string };
  assignees?: ProjectAdmin[];
  stageSet?: string;
  estimate?: string;
  actual?: string;
  flagIcon?: 'flag' | 'pin';
}

export type ProjectStatus = 'Not Started' | 'In Progress';
export type ProjectPriority = 'High' | 'Medium' | 'Low';
export type ProjectHealth = 'No Data' | 'On Track' | 'Behind' | 'Overburn';

export interface ProjectAdmin {
  initials: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  externalCode: string;
  status: ProjectStatus;
  category: string;
  priority: ProjectPriority;
  health: ProjectHealth;
  owner: { initials: string; name: string; color: string };
  admins: ProjectAdmin[];
  startDate: string;
  hasDateWarning?: boolean;
  flagIcon?: 'flag' | 'info';
  ganttStart?: string;
  ganttEnd?: string;
  progress?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
  collapsible?: boolean;
}
