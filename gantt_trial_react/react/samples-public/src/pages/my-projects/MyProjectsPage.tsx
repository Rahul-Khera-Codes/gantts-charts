import { useState } from 'react';
import AppSidebar from './components/AppSidebar';
import PageHeader from './components/PageHeader';
import ProjectsToolbar from './components/ProjectsToolbar';
import ProjectsTable from './components/ProjectsTable';
import ProjectsGantt from './components/ProjectsGantt';
import ProjectBreakdown from './components/ProjectBreakdown';
import EditProjectModal from './components/EditProjectModal';
import type { Level } from './components/LevelSelect';
import type { ProjectsView, Project } from './types';
import './MyProjectsPage.css';

export default function MyProjectsPage() {
  const [activeView, setActiveView] = useState<ProjectsView>('list');
  const [level, setLevel] = useState<Level>('Daily');
  const [breakdownProject, setBreakdownProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="rv-app">
      <AppSidebar />
      {breakdownProject ? (
        <ProjectBreakdown
          projectName={breakdownProject.name.replace('...', '')}
          onBack={() => setBreakdownProject(null)}
        />
      ) : (
        <main className="rv-main">
          <PageHeader activeView={activeView} onViewChange={setActiveView} />
          <ProjectsToolbar
            activeView={activeView}
            level={level}
            onLevelChange={setLevel}
          />
          {activeView === 'list' ? (
            <ProjectsTable
              onOpenEdit={setEditingProject}
              onGoToGantt={() => setActiveView('gantt')}
            />
          ) : (
            <ProjectsGantt level={level} onOpenBreakdown={setBreakdownProject} />
          )}
        </main>
      )}
      <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} />
    </div>
  );
}
