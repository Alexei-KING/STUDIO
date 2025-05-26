import type { ProjectStatus } from './definitions';

export const PROJECT_STATUSES: ProjectStatus[] = ["Planning", "In Progress", "Completed", "On Hold"];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "Planning", label: "Planificación" },
  { value: "In Progress", label: "En Progreso" },
  { value: "Completed", label: "Completado" },
  { value: "On Hold", label: "En Espera" },
];
