
// import type { ProjectStatus } from './definitions'; // Ya no se importa así

// Ahora PROJECT_STATUSES es una tupla readonly, lo que z.enum necesita.
export const PROJECT_STATUSES = ["Planning", "In Progress", "Completed", "On Hold"] as const;

// El tipo ProjectStatus se deriva de la tupla.
export type ProjectStatus = typeof PROJECT_STATUSES[number];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "Planning", label: "Planificación" },
  { value: "In Progress", label: "En Progreso" },
  { value: "Completed", label: "Completado" },
  { value: "On Hold", label: "En Espera" },
];
