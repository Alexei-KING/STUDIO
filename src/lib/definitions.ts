export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "On Hold";

export interface Project {
  id: string;
  projectName: string;
  location: string;
  responsibleDepartment: string;
  contactInformation: string; // Could be email, phone, or other
  tutors: string; // Comma-separated list of names or IDs
  status: ProjectStatus;
  description: string;
  projectType?: string; // AI suggested
  publicObjective?: string; // AI suggested
  scope?: string; // AI suggested
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
}
