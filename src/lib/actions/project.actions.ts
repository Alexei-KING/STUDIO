'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createProject as dbCreateProject,
  deleteProject as dbDeleteProject,
  getProjectById as dbGetProjectById,
  getProjects as dbGetProjects,
  updateProject as dbUpdateProject,
  getProjectStats as dbGetProjectStats,
  getRecentProjects as dbGetRecentProjects,
} from '../projects-store';
import type { Project, ProjectStatus } from '../definitions';
import { suggestProjectDetails as aiSuggestProjectDetails } from '@/ai/flows/suggest-project-details';
import type { SuggestProjectDetailsOutput } from '@/ai/flows/suggest-project-details';
import { PROJECT_STATUSES } from '../constants';

const ProjectSchema = z.object({
  projectName: z.string().min(3, 'El nombre del proyecto debe tener al menos 3 caracteres'),
  location: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres'),
  responsibleDepartment: z.string().min(3, 'El departamento/carrera responsable debe tener al menos 3 caracteres'),
  projectLead: z.string().min(5, 'El nombre del líder del proyecto (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  academicTutor: z.string().min(5, 'El nombre del tutor académico (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  communityTutor: z.string().min(5, 'El nombre del tutor comunitario (nombre y dos apellidos) debe tener al menos 5 caracteres.'),
  contactInformation: z.string().email('Por favor, introduce un correo electrónico válido.').min(5, 'El correo electrónico de contacto debe tener al menos 5 caracteres'),
  status: z.enum(PROJECT_STATUSES, { errorMap: () => ({ message: "Por favor, selecciona un estado válido."}) }),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  projectType: z.string().optional(),
  publicObjective: z.string().optional(),
  scope: z.string().optional(),
});

export type CreateProjectFormState = {
  errors?: {
    projectName?: string[];
    location?: string[];
    responsibleDepartment?: string[];
    projectLead?: string[];
    academicTutor?: string[];
    communityTutor?: string[];
    contactInformation?: string[];
    status?: string[];
    description?: string[];
    projectType?: string[];
    publicObjective?: string[];
    scope?: string[];
    server?: string[];
  };
  message?: string | null;
};

export async function createProjectAction(
  prevState: CreateProjectFormState | undefined,
  formData: FormData
): Promise<CreateProjectFormState> {
  const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Falló la validación. Por favor revisa los campos.',
    };
  }

  try {
    await dbCreateProject(validatedFields.data as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
  } catch (error) {
    return { message: 'Error de Base de Datos: Falló al Crear Proyecto.' };
  }

  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return { message: 'Proyecto creado exitosamente.' };
}

export async function updateProjectAction(
  id: string,
  prevState: CreateProjectFormState | undefined,
  formData: FormData
): Promise<CreateProjectFormState> {
  const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Falló la validación. Por favor revisa los campos.',
    };
  }

  try {
    await dbUpdateProject(id, validatedFields.data);
  } catch (error) {
    return { message: 'Error de Base de Datos: Falló al Actualizar Proyecto.' };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  revalidatePath(`/projects/${id}/edit`);
  revalidatePath('/dashboard');
  return { message: 'Proyecto actualizado exitosamente.' };
}

export async function deleteProjectAction(id: string) {
  try {
    const success = await dbDeleteProject(id);
    if (!success) {
      return { message: 'No se pudo eliminar el proyecto o proyecto no encontrado.', success: false };
    }
    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { message: 'Proyecto eliminado exitosamente.', success: true };
  } catch (error) {
    return { message: 'Error de Base de Datos: Falló al Eliminar Proyecto.', success: false };
  }
}

export async function getProjectsAction(query?: string) {
  return dbGetProjects(query);
}

export async function getProjectByIdAction(id: string) {
  return dbGetProjectById(id);
}

export async function getProjectStatsAction() {
  return dbGetProjectStats();
}

export async function getRecentProjectsAction(count?: number) {
  return dbGetRecentProjects(count);
}


export async function suggestProjectDetailsAction(description: string): Promise<
  { success: true; data: SuggestProjectDetailsOutput } | 
  { success: false; error: string }
> {
  if (!description || description.trim().length < 10) {
    return { success: false, error: "La descripción debe tener al menos 10 caracteres." };
  }
  try {
    const suggestion = await aiSuggestProjectDetails({ description });
    return { success: true, data: suggestion };
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return { success: false, error: "No se pudieron obtener sugerencias de la IA. Por favor, inténtalo de nuevo." };
  }
}
