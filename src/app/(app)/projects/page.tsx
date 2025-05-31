
import { getProjectsAction } from '@/lib/actions/project.actions';
import { ProjectTable } from '@/components/projects/ProjectTable';
import type { Project } from '@/lib/definitions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic'; // Asegura que la página se renderice dinámicamente

function ProjectTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-10 w-1/4 mb-4" />
      <div className="rounded-md border">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4 hidden md:block" />
            <Skeleton className="h-6 w-1/6 hidden lg:block" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6 hidden md:block" />
            <div className="flex-grow flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';
  // Fetch initial projects on the server. Client component can re-fetch or filter.
  const initialProjects: Project[] = await getProjectsAction(query);

  return (
    <Suspense fallback={<ProjectTableSkeleton />}>
      <ProjectTable initialProjects={initialProjects} />
    </Suspense>
  );
}

