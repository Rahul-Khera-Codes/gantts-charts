import AppSidebar from './components/AppSidebar';
import PageHeader from './components/PageHeader';
import ProjectsToolbar from './components/ProjectsToolbar';
import ProjectsTable from './components/ProjectsTable';
import './MyProjectsPage.css';

export default function MyProjectsPage() {
  return (
    <div className="rv-app">
      <AppSidebar />
      <main className="rv-main">
        <PageHeader />
        <ProjectsToolbar />
        <ProjectsTable />
      </main>
    </div>
  );
}
