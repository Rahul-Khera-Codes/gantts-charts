import { useState, useRef, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const menuItems = [
  { id: 'edit', label: 'Edit', icon: <EditOutlinedIcon fontSize="small" /> },
  { id: 'wp', label: 'Add Work Package', icon: <AddOutlinedIcon fontSize="small" /> },
  { id: 'task', label: 'Add Task', icon: <AddOutlinedIcon fontSize="small" /> },
  { id: 'go-wp', label: 'Go to Work Packages', icon: <ArrowForwardIcon fontSize="small" /> },
  { id: 'go-tasks', label: 'Go to Tasks', icon: <ArrowForwardIcon fontSize="small" /> },
  { id: 'go-stages', label: 'Go to Stages', icon: <ArrowForwardIcon fontSize="small" /> },
  { id: 'go-gantt', label: 'Go to Gantt View', icon: <ArrowForwardIcon fontSize="small" /> },
];

interface RowActionsMenuProps {
  defaultOpen?: boolean;
}

export default function RowActionsMenu({ defaultOpen = false }: RowActionsMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="rv-row-menu" ref={ref}>
      <button
        type="button"
        className="rv-row-menu-trigger"
        aria-label="Row actions"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertIcon fontSize="small" />
      </button>
      {open && (
        <div className="rv-row-menu-dropdown">
          {menuItems.map((item) => (
            <button key={item.id} type="button" className="rv-row-menu-item">
              <span className="rv-row-menu-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
