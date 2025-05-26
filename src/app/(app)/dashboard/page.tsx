import { PageHeader } from '@/components/shared/PageHeader';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectStatsAction, getRecentProjectsAction } from '@/lib/actions/project.actions';
import type { Project, ProjectStats } from '@/lib/definitions';
import { Users, ListChecks, PieChart, ClockRewind } from 'lucide-react';

async function DashboardPage() {
  const stats: ProjectStats = await getProjectStatsAction();
  const recentProjects: Project[] = await getRecentProjectsAction(3);

  const statItems = [
    { title: 'Total Projects', value: stats.total, icon: PieChart, color: 'text-primary' },
    { title: 'In Progress', value: stats.inProgress, icon: ClockRewind, color: 'text-blue-500' },
    { title: 'Completed', value: stats.completed, icon: ListChecks, color: 'text-green-500' },
    { title: 'Planning', value: stats.planning, icon: Users, color: 'text-yellow-500' },
  ];

  return (
    <div>
      <PageHeader title="Project Dashboard" description="Overview of community projects." />

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
        <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
        {recentProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No recent projects found.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
