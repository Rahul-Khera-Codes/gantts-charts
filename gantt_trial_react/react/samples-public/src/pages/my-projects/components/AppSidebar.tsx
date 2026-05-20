import { useState, useCallback } from 'react';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import resourceVueLogo from '../../../assets/Resource Vue Logo.svg';
import { sidebarSections } from '../data/navigation';
import SidebarIcon from './SidebarIcon';

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return (
    <aside
      className={`rv-sidebar${collapsed ? ' rv-sidebar--collapsed' : ''}`}
      data-collapsed={collapsed ? 'true' : 'false'}
    >
      <div className="rv-sidebar-brand">
        <div className="rv-logo" title="ResourceVue">
          <img
            src={resourceVueLogo}
            alt="ResourceVue"
            className="rv-logo-img"
            width={199}
            height={33}
          />
          <span className="rv-logo-compact" aria-hidden="true">
            R
          </span>
        </div>
        <button
          type="button"
          className="rv-sidebar-toggle rv-icon-btn"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <KeyboardDoubleArrowRightIcon className="rv-toggle-icon" fontSize="small" />
          ) : (
            <KeyboardDoubleArrowLeftIcon className="rv-toggle-icon" fontSize="small" />
          )}
        </button>
      </div>

      <nav className="rv-sidebar-nav">
        <button
          type="button"
          className="rv-nav-dropdown"
          title={collapsed ? 'Engineering' : undefined}
        >
          <span className="rv-nav-label">Engineering</span>
          <KeyboardArrowDownIcon className="rv-nav-chevron" fontSize="small" />
        </button>

        {sidebarSections
          .filter((section) => section.id !== 'engineering')
          .map((section) => (
            <div key={section.id} className="rv-nav-section">
              {section.title && (
                <div className="rv-nav-section-title">{section.title}</div>
              )}
              <ul className="rv-nav-list">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`rv-nav-item${item.active ? ' rv-nav-item--active' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <SidebarIcon name={item.icon} />
                      <span className="rv-nav-label">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </nav>
    </aside>
  );
}
