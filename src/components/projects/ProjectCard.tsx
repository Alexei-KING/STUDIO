import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/definitions';
import { MapPin, Building2, CalendarDays, ArrowRight, UserCircle } from 'lucide-react'; // UserCircle para Líder
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusVariant = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'default'; 
      case 'In Progress':
        return 'secondary';
      case 'Planning':
        return 'outline';
      case 'On Hold':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
     switch (status) {
      case 'Completed': return 'Completado';
      case 'In Progress': return 'En Progreso';
      case 'Planning': return 'Planificación';
      case 'On Hold': return 'En Espera';
      default: return status;
    }
  }

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.projectName}</CardTitle>
          <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <MapPin className="h-4 w-4" /> {project.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{project.description}</p>
        <div className="text-xs text-muted-foreground space-y-1">
           <p className="flex items-center gap-1">
            <UserCircle className="h-3 w-3" /> Líder: {project.projectLead}
          </p>
          <p className="flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Dpto: {project.responsibleDepartment}
          </p>
          <p className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> Creado: {format(new Date(project.createdAt), 'dd MMM, yyyy', { locale: es })}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/projects/${project.id}`}>
            Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
