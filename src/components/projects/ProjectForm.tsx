
'use client';

import { useEffect, useActionState } from 'react'; // Changed import
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { useFormState } from 'react-dom'; // Removed old import

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { PROJECT_STATUS_OPTIONS, PROJECT_STATUSES } from '@/lib/constants';
import type { Project, ProjectStatus } from '@/lib/definitions';
import { AIProjectAssistButton } from './AIProjectAssistButton';
import { useToast } from '@/hooks/use-toast';
import type { CreateProjectFormState } from '@/lib/actions/project.actions';
import { Spinner } from '@/components/shared/Spinner';
import { useRouter } from 'next/navigation';


// Nota: El schema de Zod se define en project.actions.ts para validación del lado del servidor.
// Este schema es para validación del lado del cliente y debe coincidir.
const projectFormClientSchema = z.object({
  projectName: z.string().min(3, 'El nombre del proyecto debe tener al menos 3 caracteres'),
  location: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres'),
  responsibleDepartment: z.string().min(3, 'El departamento/carrera responsable debe tener al menos 3 caracteres'),
  projectLead: z.string().min(5, 'El nombre del líder del proyecto (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  academicTutor: z.string().min(5, 'El nombre del tutor académico (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  communityTutor: z.string().min(5, 'El nombre del tutor comunitario (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  contactInformation: z.string().email('Por favor, introduce un correo electrónico válido.').min(5, 'El correo electrónico de contacto debe tener al menos 5 caracteres'),
  status: z.enum(PROJECT_STATUSES, { errorMap: () => ({ message: "Por favor, selecciona un estado válido."}) }),
  statusDescription: z.string().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres para la Asistencia IA y el envío.'),
  projectType: z.string().optional(),
  publicObjective: z.string().optional(),
  scope: z.string().optional(),
});


export type ProjectFormData = z.infer<typeof projectFormClientSchema>;

interface ProjectFormProps {
  project?: Project;
  formAction: (prevState: CreateProjectFormState | undefined, formData: FormData) => Promise<CreateProjectFormState>;
  isEditMode?: boolean;
}

export function ProjectForm({ project, formAction, isEditMode = false }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, dispatch] = useActionState(formAction, undefined); // Changed to useActionState

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    control,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormClientSchema),
    defaultValues: project
      ? {
          ...project,
          status: project.status as ProjectStatus,
          statusDescription: project.statusDescription || '',
        }
      : {
          projectName: '',
          location: '',
          responsibleDepartment: '',
          projectLead: '',
          academicTutor: '',
          communityTutor: '',
          contactInformation: '',
          status: 'Planning',
          statusDescription: '',
          description: '',
          projectType: '',
          publicObjective: '',
          scope: '',
        },
  });

  const currentDescription = watch('description');
  const currentStatus = watch('status');

  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Éxito', description: state.message, className: 'bg-accent text-accent-foreground border-accent' });
        if (!isEditMode) {
           reset();
           router.push('/projects');
        } else if (project) {
            router.push(`/projects/${project.id}`);
        }
      }
    }
  }, [state, toast, isEditMode, reset, router, project]);


  return (
    <form action={dispatch} className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Actualiza los detalles del proyecto existente.' : 'Completa los detalles para registrar un nuevo proyecto comunitario.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="projectName">Nombre del Proyecto</Label>
              <Input id="projectName" {...register('projectName')} aria-invalid={errors.projectName ? "true" : "false"} />
              {errors.projectName && <p className="text-sm text-destructive mt-1">{errors.projectName.message}</p>}
              {state?.errors?.projectName && state.errors.projectName.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" {...register('location')} aria-invalid={errors.location ? "true" : "false"} />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
              {state?.errors?.location && state.errors.location.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
             <div>
              <Label htmlFor="projectLead">Líder del Proyecto (Nombre y dos Apellidos)</Label>
              <Input id="projectLead" {...register('projectLead')} placeholder="Ej: Ana María Pérez Gónzalez" aria-invalid={errors.projectLead ? "true" : "false"}/>
              {errors.projectLead && <p className="text-sm text-destructive mt-1">{errors.projectLead.message}</p>}
              {state?.errors?.projectLead && state.errors.projectLead.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="responsibleDepartment">Departamento/Carrera Responsable</Label>
              <Input id="responsibleDepartment" {...register('responsibleDepartment')} aria-invalid={errors.responsibleDepartment ? "true" : "false"} />
              {errors.responsibleDepartment && <p className="text-sm text-destructive mt-1">{errors.responsibleDepartment.message}</p>}
              {state?.errors?.responsibleDepartment && state.errors.responsibleDepartment.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="academicTutor">Tutor Académico (Nombre y dos Apellidos)</Label>
              <Input id="academicTutor" {...register('academicTutor')} placeholder="Ej: Prof. Juan Carlos López Silva" aria-invalid={errors.academicTutor ? "true" : "false"}/>
              {errors.academicTutor && <p className="text-sm text-destructive mt-1">{errors.academicTutor.message}</p>}
              {state?.errors?.academicTutor && state.errors.academicTutor.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="communityTutor">Tutor Comunitario (Nombre y dos Apellidos)</Label>
              <Input id="communityTutor" {...register('communityTutor')} placeholder="Ej: Sra. Luisa Fernanda Rivas Mata" aria-invalid={errors.communityTutor ? "true" : "false"}/>
              {errors.communityTutor && <p className="text-sm text-destructive mt-1">{errors.communityTutor.message}</p>}
              {state?.errors?.communityTutor && state.errors.communityTutor.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="contactInformation">Correo Electrónico de Contacto Principal</Label>
              <Input type="email" id="contactInformation" {...register('contactInformation')} placeholder="ejemplo@unefa.edu.ve" aria-invalid={errors.contactInformation ? "true" : "false"} />
              {errors.contactInformation && <p className="text-sm text-destructive mt-1">{errors.contactInformation.message}</p>}
              {state?.errors?.contactInformation && state.errors.contactInformation.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" aria-invalid={errors.status ? "true" : "false"}>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
              {state?.errors?.status && state.errors.status.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
          </div>

          {currentStatus !== 'Completed' && (
            <div>
              <Label htmlFor="statusDescription">Notas Adicionales sobre el Estado (Opcional)</Label>
              <Textarea
                  id="statusDescription"
                  rows={3}
                  {...register('statusDescription')}
                  placeholder="Escribe aquí cualquier detalle relevante sobre el estado actual del proyecto (ej: motivo de pausa, próximo hito, etc.)"
                  aria-invalid={errors.statusDescription ? "true" : "false"}
              />
              {errors.statusDescription && <p className="text-sm text-destructive mt-1">{errors.statusDescription.message}</p>}
              {state?.errors?.statusDescription && state.errors.statusDescription.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
          )}

          <div>
            <Label htmlFor="description">Descripción Detallada del Proyecto</Label>
            <Textarea
              id="description"
              rows={5}
              {...register('description')}
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="Describe la intención, objetivos y actividades del proyecto..."
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            {state?.errors?.description && state.errors.description.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
          </div>

          <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-lg font-semibold">Asistencia IA para Proyectos</h3>
                <AIProjectAssistButton currentDescription={currentDescription} setValue={setValue} />
            </div>
            <p className="text-sm text-muted-foreground">
              Proporciona una descripción detallada arriba, luego haz clic en "Sugerir con IA" para obtener ayuda con Tipo de Proyecto, Objetivo Público y Alcance.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
                <div>
                  <Label htmlFor="projectType">Tipo de Proyecto (Sugerido por IA)</Label>
                  <Input id="projectType" {...register('projectType')} />
                  {errors.projectType && <p className="text-sm text-destructive mt-1">{errors.projectType.message}</p>}
                  {state?.errors?.projectType && state.errors.projectType.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
                </div>
                <div>
                  <Label htmlFor="publicObjective">Objetivo Público (Sugerido por IA)</Label>
                  <Input id="publicObjective" {...register('publicObjective')} />
                  {errors.publicObjective && <p className="text-sm text-destructive mt-1">{errors.publicObjective.message}</p>}
                  {state?.errors?.publicObjective && state.errors.publicObjective.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
                </div>
                <div>
                  <Label htmlFor="scope">Alcance (Sugerido por IA)</Label>
                  <Input id="scope" {...register('scope')} />
                  {errors.scope && <p className="text-sm text-destructive mt-1">{errors.scope.message}</p>}
                  {state?.errors?.scope && state.errors.scope.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
                </div>
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
            {isEditMode ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
           {state?.errors?.server && state.errors.server.map(e => <p key={e} className="text-sm text-destructive ml-4">{e}</p>)}
        </CardFooter>
      </Card>
    </form>
  );
}

    