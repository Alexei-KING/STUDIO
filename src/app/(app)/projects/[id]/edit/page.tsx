import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { getProjectByIdAction, updateProjectAction } from '@/lib/actions/project.actions';
import type { Project } from '@/lib/definitions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project: Project | undefined = await getProjectByIdAction(params.id);

  if (!project) {
    notFound();
  }

  const updateProjectActionWithId = updateProjectAction.bind(null, project.id);

  return (
    <div>
      <PageHeader
        title="Editar Proyecto"
        description={`Actualizar detalles del proyecto: ${project.projectName}`}
      />
      <ProjectForm project={project} formAction={updateProjectActionWithId} isEditMode />
    </div>
  );
}
