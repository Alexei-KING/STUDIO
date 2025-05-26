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
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  responsibleDepartment: z.string().min(3, 'Department must be at least 3 characters'),
  contactInformation: z.string().min(5, 'Contact info must be at least 5 characters'), // Simple validation
  tutors: z.string().min(3, 'Tutors field must be at least 3 characters'),
  status: z.enum(PROJECT_STATUSES),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  projectType: z.string().optional(),
  publicObjective: z.string().optional(),
  scope: z.string().optional(),
});

export type CreateProjectFormState = {
  errors?: {
    projectName?: string[];
    location?: string[];
    responsibleDepartment?: string[];
    contactInformation?: string[];
    tutors?: string[];
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
      message: 'Validation failed. Please check the fields.',
    };
  }

  try {
    await dbCreateProject(validatedFields.data as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
  } catch (error) {
    return { message: 'Database Error: Failed to Create Project.' };
  }

  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return { message: 'Project created successfully.' };
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
      message: 'Validation failed. Please check the fields.',
    };
  }

  try {
    await dbUpdateProject(id, validatedFields.data);
  } catch (error) {
    return { message: 'Database Error: Failed to Update Project.' };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  revalidatePath(`/projects/${id}/edit`);
  revalidatePath('/dashboard');
  return { message: 'Project updated successfully.' };
}

export async function deleteProjectAction(id: string) {
  try {
    const success = await dbDeleteProject(id);
    if (!success) {
      return { message: 'Failed to delete project or project not found.', success: false };
    }
    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { message: 'Project deleted successfully.', success: true };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Project.', success: false };
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
    return { success: false, error: "Description must be at least 10 characters long." };
  }
  try {
    const suggestion = await aiSuggestProjectDetails({ description });
    return { success: true, data: suggestion };
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return { success: false, error: "Failed to get AI suggestions. Please try again." };
  }
}
