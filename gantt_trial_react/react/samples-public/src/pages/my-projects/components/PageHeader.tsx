import { useState } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { statusTabs } from '../data/navigation';
import type { ProjectsView } from '../types';
import userAvatar from '../../../assets/76523b16af64de64bfd8e4730147a4492ab87212.png';
import lockButtonSvg from '../../../assets/_Button_.svg?raw';
import listIconSvg from '../../../assets/FormatListBulletedFilled.svg?raw';
import waterfallIconSvg from '../../../assets/WaterfallChartFilled.svg?raw';

interface PageHeaderProps {
  activeView: ProjectsView;
  onViewChange: (view: ProjectsView) => void;
}

export default function PageHeader({ activeView, onViewChange }: PageHeaderProps) {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [lockHidden, setLockHidden] = useState(false);

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
              src={userAvatar}
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
          {activeView === 'list' && !lockHidden && (
            <button
              type="button"
              className="rv-view-toggle rv-view-toggle--lock"
              aria-label="Lock view"
              onClick={() => setLockHidden(true)}
              dangerouslySetInnerHTML={{ __html: lockButtonSvg }}
            />
          )}
          <div className="rv-view-toggle-group">
            <button
              type="button"
              className={`rv-view-toggle rv-view-toggle--icon${activeView === 'list' ? ' rv-view-toggle--active' : ''}`}
              aria-label="List view"
              onClick={() => onViewChange('list')}
              dangerouslySetInnerHTML={{ __html: listIconSvg }}
            />
            <button
              type="button"
              className={`rv-view-toggle rv-view-toggle--icon${activeView === 'gantt' ? ' rv-view-toggle--active' : ''}`}
              aria-label="Gantt view"
              onClick={() => onViewChange('gantt')}
              dangerouslySetInnerHTML={{ __html: waterfallIconSvg }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
