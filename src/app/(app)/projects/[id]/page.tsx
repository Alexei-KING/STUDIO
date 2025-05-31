
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProjectByIdAction } from '@/lib/actions/project.actions';
import type { Project, ProjectStatus } from '@/lib/definitions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formato de fecha en español
import {
  MapPin,
  Building2,
  Mail,
  Users,
  User, // Para Líder de Proyecto
  BookUser, // Para Tutor Académico
  Users2, // Para Tutor Comunitario
  Activity,
  FileText,
  Edit,
  CalendarDays,
  Target,
  ClipboardList,
  Info,
  UserSquare, // Icono alternativo para Líder de proyecto
  MessageSquareText, // Para la descripción del estado
} from 'lucide-react';
// Image component is no longer needed
// import Image from 'next/image';

export const dynamic = 'force-dynamic'; 

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
  
  const getStatusLabel = (status: ProjectStatus) => {
     switch (status) {
      case 'Completed': return 'Completado';
      case 'In Progress': return 'En Progreso';
      case 'Planning': return 'Planificación';
      case 'On Hold': return 'En Espera';
      default: return status;
    }
  }

  const detailItems = [
    { label: 'Líder del Proyecto', value: project.projectLead, icon: UserSquare },
    { label: 'Ubicación', value: project.location, icon: MapPin },
    { label: 'Departamento/Carrera Responsable', value: project.responsibleDepartment, icon: Building2 },
    { label: 'Tutor Académico', value: project.academicTutor, icon: BookUser },
    { label: 'Tutor Comunitario', value: project.communityTutor, icon: Users2 },
    { label: 'Correo Electrónico de Contacto', value: project.contactInformation, icon: Mail },
    { 
      label: 'Estado', 
      value: (
        <div className="flex flex-col items-start">
          <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
          {project.statusDescription && (
            <div className="mt-1.5 flex items-start text-xs text-muted-foreground">
              <MessageSquareText className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 relative top-0.5" />
              <span>{project.statusDescription}</span>
            </div>
          )}
        </div>
      ), 
      icon: Activity 
    },
  ];

  const aiSuggestedItems = [
    { label: 'Tipo de Proyecto', value: project.projectType, icon: Info },
    { label: 'Objetivo Público', value: project.publicObjective, icon: Target },
    { label: 'Alcance', value: project.scope, icon: ClipboardList },
  ].filter(item => item.value);


  return (
    <div>
      <PageHeader title={project.projectName} description={`Vista detallada del proyecto ID: ${project.id}`}>
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Editar Proyecto
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Resumen del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Creado: {format(new Date(project.createdAt), 'dd MMMM, yyyy HH:mm', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Última Actualización: {format(new Date(project.updatedAt), 'dd MMMM, yyyy HH:mm', { locale: es })}</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Descripción del Proyecto
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          {aiSuggestedItems.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Detalles Sugeridos por IA</CardTitle>
                <CardDescription>Estos detalles fueron sugeridos o completados con asistencia de IA.</CardDescription>
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
              <CardTitle>Información Clave</CardTitle>
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
          {/* Card for Project Image has been removed */}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;

