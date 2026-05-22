import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import dashboardSvg from '../../../assets/Dashboard.svg?raw';
import groupProjectsSvg from '../../../assets/Group Projects.svg?raw';
import externalRequestsSvg from '../../../assets/external requests.svg?raw';
import groupTasksSvg from '../../../assets/group tasks.svg?raw';
import groupTimesheetSvg from '../../../assets/group timesheet.svg?raw';
import groupWorkPackageSvg from '../../../assets/group work package.svg?raw';
import heatmapSvg from '../../../assets/heatmap.svg?raw';
import myWorkPackageSvg from '../../../assets/my Work Package.svg?raw';
import myTasksSvg from '../../../assets/my tasks.svg?raw';
import myTimesheetSvg from '../../../assets/my timesheet.svg?raw';
import resourceAllocationSvg from '../../../assets/resource allocation.svg?raw';

const iconMap: Record<string, string> = {
  dashboard: dashboardSvg,
  'my-projects': myWorkPackageSvg,
  'group-projects': groupProjectsSvg,
  'my-wp': myWorkPackageSvg,
  'group-wp': groupWorkPackageSvg,
  external: externalRequestsSvg,
  allocation: resourceAllocationSvg,
  heatmap: heatmapSvg,
  'my-tasks': myTasksSvg,
  'group-tasks': groupTasksSvg,
  'my-timesheet': myTimesheetSvg,
  'group-timesheet': groupTimesheetSvg,
};

interface SidebarIconProps {
  name: string;
}

export default function SidebarIcon({ name }: SidebarIconProps) {
  const svg = iconMap[name];
  if (!svg) return <span className="rv-sidebar-icon" />;
  return (
    <span
      className="rv-sidebar-icon"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export { KeyboardArrowDownIcon };
