export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "On Hold";

export interface Project {
  id: string;
  projectName: string;
  location: string;
  responsibleDepartment: string; // Departamento o carrera responsable
  projectLead: string; // Nombre y apellidos del líder/propietario del proyecto
  academicTutor: string; // Nombre del tutor académico
  communityTutor: string; // Nombre del tutor comunitario
  contactInformation: string; // Correo electrónico de contacto principal
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
