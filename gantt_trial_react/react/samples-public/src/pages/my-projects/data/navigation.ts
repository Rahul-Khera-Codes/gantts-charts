import type { NavSection } from '../types';

export const sidebarSections: NavSection[] = [
  {
    id: 'engineering',
    title: 'Engineering',
    collapsible: true,
    items: [],
  },
  {
    id: 'projects',
    title: 'Projects',
    items: [
      { id: 'proj-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'my-projects', label: 'My Projects', icon: 'my-projects', active: true },
      { id: 'group-projects', label: 'Group Projects', icon: 'group-projects' },
    ],
  },
  {
    id: 'work-packages',
    title: 'Work Packages',
    items: [
      { id: 'wp-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'my-wp', label: 'My Work Packages', icon: 'my-wp' },
      { id: 'group-wp', label: 'Group Work Packages', icon: 'group-wp' },
      { id: 'external', label: 'External Requests', icon: 'external' },
      { id: 'allocation', label: 'Resource Allocation', icon: 'allocation' },
    ],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    items: [
      { id: 'heatmap', label: 'Heatmap', icon: 'heatmap' },
      { id: 'my-tasks', label: 'My Tasks', icon: 'my-tasks' },
      { id: 'group-tasks', label: 'Group Tasks', icon: 'group-tasks' },
      { id: 'my-timesheet', label: 'My Timesheet', icon: 'my-timesheet' },
      { id: 'group-timesheet', label: 'Group Timesheet', icon: 'group-timesheet' },
    ],
  },
];

export const statusTabs = ['ALL', 'OPEN', 'CLOSED', 'CANCELLED'] as const;
