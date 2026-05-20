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
