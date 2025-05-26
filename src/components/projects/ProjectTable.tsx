'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Search, PlusCircle } from 'lucide-react';
import type { Project, ProjectStatus } from '@/lib/definitions';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { getProjectsAction } from '@/lib/actions/project.actions';
import { Spinner } from '@/components/shared/Spinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card'; // Importado para los estados vacíos

export function ProjectTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleSearch = () => {
    startTransition(async () => {
      const fetchedProjects = await getProjectsAction(searchTerm);
      setProjects(fetchedProjects);
    });
  };
  
  const refreshProjects = () => {
     startTransition(async () => {
      const fetchedProjects = await getProjectsAction(searchTerm); 
      setProjects(fetchedProjects);
    });
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

  return (
    <div>
      <PageHeader title="Proyectos Comunitarios" description="Gestiona y visualiza todos los proyectos comunitarios.">
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Proyecto
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? <Spinner size="sm" /> : <Search className="h-4 w-4" />}
          <span className="sr-only">Buscar</span>
        </Button>
      </div>

      {isPending && projects.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      )}

      {!isPending && projects.length === 0 && searchTerm && (
         <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No se encontraron proyectos para tus criterios de búsqueda.</p>
          </CardContent>
        </Card>
      )}
      
      {!isPending && projects.length === 0 && !searchTerm && (
        <Card className="mt-6">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold mb-2">¡Aún no hay proyectos!</p>
            <p className="text-muted-foreground mb-4">Sé el primero en agregar un proyecto comunitario.</p>
            <Button asChild>
              <Link href="/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Proyecto
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}


      {projects.length > 0 && (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Proyecto</TableHead>
                <TableHead className="hidden md:table-cell">Departamento/Carrera</TableHead>
                <TableHead className="hidden lg:table-cell">Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.projectName}</TableCell>
                  <TableCell className="hidden md:table-cell">{project.responsibleDepartment}</TableCell>
                  <TableCell className="hidden lg:table-cell">{project.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(project.createdAt), 'dd MMM, yyyy', { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/projects/${project.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <DeleteProjectDialog 
                        projectId={project.id} 
                        projectName={project.projectName}
                        onDeleted={refreshProjects}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
