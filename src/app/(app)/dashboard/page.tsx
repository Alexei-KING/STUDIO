import { PageHeader } from '@/components/shared/PageHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectStatsAction, getRecentProjectsAction } from '@/lib/actions/project.actions';
import type { Project, ProjectStats } from '@/lib/definitions';
import { Users, ListChecks, PieChart, Clock } from 'lucide-react'; // Asegurado Clock en lugar de ClockRewind

async function DashboardPage() {
  const stats: ProjectStats = await getProjectStatsAction();
  const recentProjects: Project[] = await getRecentProjectsAction(3);

  const statItems = [
    { title: 'Proyectos Totales', value: stats.total, icon: PieChart, color: 'text-primary' },
    { title: 'En Progreso', value: stats.inProgress, icon: Clock, color: 'text-blue-500' },
    { title: 'Completados', value: stats.completed, icon: ListChecks, color: 'text-green-500' },
    { title: 'Planificación', value: stats.planning, icon: Users, color: 'text-yellow-500' },
  ];

  return (
    <div>
      <PageHeader title="Panel de Proyectos" description="Resumen de los proyectos comunitarios." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statItems.map((item) => (
          <Card key={item.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Proyectos Recientes</h3>
        {recentProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No se encontraron proyectos recientes.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
