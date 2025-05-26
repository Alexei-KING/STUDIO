import { ProjectForm } from '@/components/projects/ProjectForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { createProjectAction } from '@/lib/actions/project.actions';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        title="Create New Project"
        description="Fill in the details for the new community project."
      />
      <ProjectForm formAction={createProjectAction} />
    </div>
  );
}
