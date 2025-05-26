import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProjectByIdAction } from '@/lib/actions/project.actions';
import type { Project, ProjectStatus } from '@/lib/definitions';
import { format } from 'date-fns';
import {
  MapPin,
  Building2,
  Mail,
  Users,
  Activity,
  FileText,
  Edit,
  CalendarDays,
  Target,
  ClipboardList,
  Info,
} from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request for this page

async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project: Project | undefined = await getProjectByIdAction(params.id);

  if (!project) {
    notFound();
  }

  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Planning': return 'outline';
      case 'On Hold': return 'destructive';
      default: return 'outline';
    }
  };

  const detailItems = [
    { label: 'Location', value: project.location, icon: MapPin },
    { label: 'Responsible Department', value: project.responsibleDepartment, icon: Building2 },
    { label: 'Contact Information', value: project.contactInformation, icon: Mail },
    { label: 'Tutor(s)', value: project.tutors, icon: Users },
    { label: 'Status', value: <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>, icon: Activity },
  ];

  const aiSuggestedItems = [
    { label: 'Project Type', value: project.projectType, icon: Info },
    { label: 'Public Objective', value: project.publicObjective, icon: Target },
    { label: 'Scope', value: project.scope, icon: ClipboardList },
  ].filter(item => item.value);


  return (
    <div>
      <PageHeader title={project.projectName} description={`Detailed view of project ID: ${project.id}`}>
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Project
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Created: {format(new Date(project.createdAt), 'MMMM dd, yyyy HH:mm')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Last Updated: {format(new Date(project.updatedAt), 'MMMM dd, yyyy HH:mm')}</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Description
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          {aiSuggestedItems.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>AI Suggested Details</CardTitle>
                <CardDescription>These details were suggested or filled with AI assistance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestedItems.map(item => (
                  item.value && (
                    <div key={item.label}>
                      <h4 className="font-medium text-md flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-primary" /> {item.label}
                      </h4>
                      <p className="text-foreground ml-6">{typeof item.value === 'string' ? item.value : item.value}</p>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {detailItems.map(item => (
                <div key={item.label}>
                  <h4 className="font-medium text-md flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-primary" /> {item.label}
                  </h4>
                  <div className="text-foreground ml-6">{typeof item.value === 'string' ? item.value : item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-lg" data-ai-hint="community collaboration">
             <CardHeader>
                <CardTitle>Project Image</CardTitle>
             </CardHeader>
             <CardContent>
                <Image 
                    src="https://placehold.co/600x400.png" 
                    alt={project.projectName} 
                    width={600} 
                    height={400}
                    className="rounded-md object-cover aspect-video"
                    data-ai-hint="community project"
                />
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
