'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState } from 'react-dom';

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


const projectFormSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  responsibleDepartment: z.string().min(3, 'Department must be at least 3 characters'),
  contactInformation: z.string().min(5, 'Contact info must be at least 5 characters'),
  tutors: z.string().min(3, 'Tutors field must be at least 3 characters'),
  status: z.enum(PROJECT_STATUSES),
  description: z.string().min(10, 'Description must be at least 10 characters long for AI Assist and submission.'),
  projectType: z.string().optional(),
  publicObjective: z.string().optional(),
  scope: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: Project;
  formAction: (prevState: CreateProjectFormState | undefined, formData: FormData) => Promise<CreateProjectFormState>;
  isEditMode?: boolean;
}

export function ProjectForm({ project, formAction, isEditMode = false }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [state, dispatch] = useFormState(formAction, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          ...project,
          status: project.status as ProjectStatus,
        }
      : {
          status: 'Planning',
          description: '',
        },
  });

  const currentDescription = watch('description');

  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: state.message, className: 'bg-accent text-accent-foreground border-accent' });
        if (!isEditMode) { // If creating new project
           reset(); // Reset form after successful creation
           router.push('/projects'); // Redirect to project list
        } else if (project) { // If editing, redirect to project detail page
            router.push(`/projects/${project.id}`);
        }

      }
    }
  }, [state, toast, isEditMode, reset, router, project]);


  return (
    <form action={dispatch} className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Update the details of the existing project.' : 'Fill in the details to register a new community project.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" {...register('projectName')} aria-invalid={errors.projectName ? "true" : "false"} />
              {errors.projectName && <p className="text-sm text-destructive mt-1">{errors.projectName.message}</p>}
              {state?.errors?.projectName && state.errors.projectName.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} aria-invalid={errors.location ? "true" : "false"} />
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
              {state?.errors?.location && state.errors.location.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="responsibleDepartment">Responsible Department</Label>
              <Input id="responsibleDepartment" {...register('responsibleDepartment')} aria-invalid={errors.responsibleDepartment ? "true" : "false"} />
              {errors.responsibleDepartment && <p className="text-sm text-destructive mt-1">{errors.responsibleDepartment.message}</p>}
              {state?.errors?.responsibleDepartment && state.errors.responsibleDepartment.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="contactInformation">Contact Information</Label>
              <Input id="contactInformation" {...register('contactInformation')} aria-invalid={errors.contactInformation ? "true" : "false"} />
              {errors.contactInformation && <p className="text-sm text-destructive mt-1">{errors.contactInformation.message}</p>}
              {state?.errors?.contactInformation && state.errors.contactInformation.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="tutors">Tutor(s)</Label>
              <Input id="tutors" {...register('tutors')} placeholder="e.g., Prof. Jane Doe, Dr. John Smith" aria-invalid={errors.tutors ? "true" : "false"}/>
              {errors.tutors && <p className="text-sm text-destructive mt-1">{errors.tutors.message}</p>}
              {state?.errors?.tutors && state.errors.tutors.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status" aria-invalid={errors.status ? "true" : "false"}>
                      <SelectValue placeholder="Select status" />
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

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              rows={5}
              {...register('description')}
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="Describe the project's intent, objectives, and activities..."
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            {state?.errors?.description && state.errors.description.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
          </div>
          
          <div className="space-y-2 p-4 border rounded-md bg-secondary/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-lg font-semibold">AI Project Assist</h3>
                <AIProjectAssistButton currentDescription={currentDescription} setValue={setValue} />
            </div>
            <p className="text-sm text-muted-foreground">
              Provide a detailed description above, then click "Suggest with AI" to get help with Project Type, Public Objective, and Scope.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-4">
                <div>
                  <Label htmlFor="projectType">Project Type (AI Suggested)</Label>
                  <Input id="projectType" {...register('projectType')} />
                  {errors.projectType && <p className="text-sm text-destructive mt-1">{errors.projectType.message}</p>}
                  {state?.errors?.projectType && state.errors.projectType.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
                </div>
                <div>
                  <Label htmlFor="publicObjective">Public Objective (AI Suggested)</Label>
                  <Input id="publicObjective" {...register('publicObjective')} />
                  {errors.publicObjective && <p className="text-sm text-destructive mt-1">{errors.publicObjective.message}</p>}
                  {state?.errors?.publicObjective && state.errors.publicObjective.map(e => <p key={e} className="text-sm text-destructive mt-1">{e}</p>)}
                </div>
                <div>
                  <Label htmlFor="scope">Scope (AI Suggested)</Label>
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
            {isEditMode ? 'Save Changes' : 'Create Project'}
          </Button>
           {state?.errors?.server && state.errors.server.map(e => <p key={e} className="text-sm text-destructive ml-4">{e}</p>)}
        </CardFooter>
      </Card>
    </form>
  );
}

// Controller needed for ShadCN Select with RHF
import { Controller } from 'react-hook-form';
