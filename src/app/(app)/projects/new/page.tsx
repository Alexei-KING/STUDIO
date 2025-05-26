import { ProjectForm } from '@/components/projects/ProjectForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { createProjectAction } from '@/lib/actions/project.actions';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        title="Crear Nuevo Proyecto"
        description="Completa los detalles para el nuevo proyecto comunitario."
      />
      <ProjectForm formAction={createProjectAction} />
    </div>
  );
}
