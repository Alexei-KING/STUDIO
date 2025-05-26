import type { Project, ProjectStatus, ProjectStats } from './definitions';

let projects: Project[] = [
  {
    id: '1',
    projectName: 'Iniciativa de Huerto Comunitario',
    location: 'Sector El Limón, Maracay',
    responsibleDepartment: 'Ingeniería Agronómica',
    projectLead: 'Valeria Rojas Gómez',
    academicTutor: 'Prof. María Silva',
    communityTutor: 'Sr. Carlos Méndez',
    contactInformation: 'v.rojas@unefa.edu.ve',
    status: 'In Progress',
    description: 'Desarrollo de un huerto comunitario para promover la agricultura sostenible y proveer productos frescos a familias locales.',
    projectType: 'Desarrollo Agrícola',
    publicObjective: 'Mejorar la seguridad alimentaria y promover prácticas sostenibles.',
    scope: 'Establecimiento de parcelas de cultivo, talleres de capacitación y alcance comunitario.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '2',
    projectName: 'Programa de Alfabetización Digital para Adultos Mayores',
    location: 'UNEFA Extensión Cagua',
    responsibleDepartment: 'Ingeniería de Sistemas',
    projectLead: 'Luis Alberto Torres',
    academicTutor: 'Prof. Ana Rodríguez',
    communityTutor: 'Sra. Carmen Rivas',
    contactInformation: 'l.torres@unefa.edu.ve',
    status: 'Planning',
    description: 'Un programa para enseñar habilidades básicas de computación e internet a adultos mayores de la comunidad.',
    projectType: 'Programa Educativo',
    publicObjective: 'Mejorar la inclusión digital de los adultos mayores.',
    scope: 'Talleres semanales, asistencia personalizada y desarrollo de material de recursos.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    projectName: 'Campaña de Limpieza del Río Turmero',
    location: 'Riberas del Río Turmero, Turmero',
    responsibleDepartment: 'Ingeniería Civil y Ciencias Ambientales',
    projectLead: 'Sofía Contreras Díaz',
    academicTutor: 'Prof. Luis Fernández',
    communityTutor: 'Sr. José Alarcón (Líder Vecinal)',
    contactInformation: 's.contreras@unefa.edu.ve',
    status: 'Completed',
    description: 'Jornadas de limpieza organizadas a lo largo del río Turmero para remover desechos y concienciar sobre el medio ambiente.',
    projectType: 'Conservación Ambiental',
    publicObjective: 'Reducir la contaminación del río y promover la participación comunitaria en la protección ambiental.',
    scope: 'Tres eventos de limpieza, clasificación y reciclaje de residuos, charlas de concienciación en escuelas locales.',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProjects(query?: string): Promise<Project[]> {
  await delay(500);
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    return projects.filter(p => 
      p.projectName.toLowerCase().includes(lowerCaseQuery) ||
      p.responsibleDepartment.toLowerCase().includes(lowerCaseQuery) ||
      p.location.toLowerCase().includes(lowerCaseQuery) ||
      p.projectLead.toLowerCase().includes(lowerCaseQuery) ||
      p.academicTutor.toLowerCase().includes(lowerCaseQuery) ||
      p.communityTutor.toLowerCase().includes(lowerCaseQuery)
    );
  }
  return [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await delay(300);
  return projects.find(p => p.id === id);
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  await delay(700);
  const newProject: Project = {
    ...data,
    id: String(Date.now() + Math.random()), // Simple unique ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects = [newProject, ...projects];
  return newProject;
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project | undefined> {
  await delay(700);
  const projectIndex = projects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return undefined;
  }
  const updatedProject = {
    ...projects[projectIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  projects[projectIndex] = updatedProject;
  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  await delay(500);
  const initialLength = projects.length;
  projects = projects.filter(p => p.id !== id);
  return projects.length < initialLength;
}

export async function getProjectStats(): Promise<ProjectStats> {
  await delay(200);
  const stats: ProjectStats = {
    total: projects.length,
    planning: projects.filter(p => p.status === 'Planning').length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    onHold: projects.filter(p => p.status === 'On Hold').length,
  };
  return stats;
}

export async function getRecentProjects(count: number = 3): Promise<Project[]> {
  await delay(400);
  return [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}
