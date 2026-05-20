import type { ReactNode } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const iconMap: Record<string, ReactNode> = {
  dashboard: <DashboardOutlinedIcon fontSize="small" />,
  person: <PersonOutlineIcon fontSize="small" />,
  group: <GroupsOutlinedIcon fontSize="small" />,
  external: <RequestQuoteOutlinedIcon fontSize="small" />,
  allocation: <AccountTreeOutlinedIcon fontSize="small" />,
  heatmap: <GridViewOutlinedIcon fontSize="small" />,
  timesheet: <ScheduleOutlinedIcon fontSize="small" />,
  engineering: <EngineeringOutlinedIcon fontSize="small" />,
};

interface SidebarIconProps {
  name: string;
}

export default function SidebarIcon({ name }: SidebarIconProps) {
  return <span className="rv-sidebar-icon">{iconMap[name] ?? null}</span>;
}

export { KeyboardArrowDownIcon };
