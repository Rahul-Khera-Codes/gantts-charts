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
      { id: 'my-projects', label: 'My Projects', icon: 'person', active: true },
      { id: 'group-projects', label: 'Group Projects', icon: 'group' },
    ],
  },
  {
    id: 'work-packages',
    title: 'Work Packages',
    items: [
      { id: 'wp-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'my-wp', label: 'My Work Packages', icon: 'person' },
      { id: 'group-wp', label: 'Group Work Packages', icon: 'group' },
      { id: 'external', label: 'External Requests', icon: 'external' },
      { id: 'allocation', label: 'Resource Allocation', icon: 'allocation' },
    ],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    items: [
      { id: 'heatmap', label: 'Heatmap', icon: 'heatmap' },
      { id: 'my-tasks', label: 'My Tasks', icon: 'person' },
      { id: 'group-tasks', label: 'Group Tasks', icon: 'group' },
      { id: 'my-timesheet', label: 'My Timesheet', icon: 'timesheet' },
      { id: 'group-timesheet', label: 'Group Timesheet', icon: 'timesheet' },
    ],
  },
];

export const statusTabs = ['ALL', 'OPEN', 'CLOSED', 'CANCELLED'] as const;
