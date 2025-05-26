import type { ProjectStatus } from './definitions';

export const PROJECT_STATUSES: ProjectStatus[] = ["Planning", "In Progress", "Completed", "On Hold"];

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "Planning", label: "Planning" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "On Hold", label: "On Hold" },
];
