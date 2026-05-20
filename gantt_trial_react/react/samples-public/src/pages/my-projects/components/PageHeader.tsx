import { useState } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import { statusTabs } from '../data/navigation';

export default function PageHeader() {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  return (
    <header className="rv-page-header">
      <div className="rv-page-header-top">
        <h1 className="rv-page-title">My Projects</h1>
        <div className="rv-page-header-actions">
          <button type="button" className="rv-icon-btn" aria-label="Notifications">
            <NotificationsNoneOutlinedIcon />
          </button>
          <div className="rv-user-avatar">
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="User profile"
              className="rv-user-avatar-img"
            />
          </div>
        </div>
      </div>

      <div className="rv-page-header-bottom">
        <div className="rv-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rv-tab${activeTab === tab ? ' rv-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rv-view-toggles">
          <button type="button" className="rv-view-toggle rv-view-toggle--locked" aria-label="Lock view">
            <LockOutlinedIcon fontSize="small" />
          </button>
          <button type="button" className="rv-view-toggle rv-view-toggle--active" aria-label="List view">
            <ViewListOutlinedIcon fontSize="small" />
          </button>
          <button type="button" className="rv-view-toggle" aria-label="Gantt view">
            <ViewColumnOutlinedIcon fontSize="small" />
          </button>
        </div>
      </div>
    </header>
  );
}
