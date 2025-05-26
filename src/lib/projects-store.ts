import type { Project, ProjectStatus, ProjectStats } from './definitions';

let projects: Project[] = [
  {
    id: '1',
    projectName: 'Community Garden Initiative',
    location: 'Sector El Limón, Maracay',
    responsibleDepartment: 'Agricultural Engineering',
    contactInformation: 'j.perez@unefa.edu.ve',
    tutors: 'Prof. Maria Silva, Prof. Carlos Mendez',
    status: 'In Progress',
    description: 'Development of a community garden to promote sustainable agriculture and provide fresh produce to local families.',
    projectType: 'Agricultural Development',
    publicObjective: 'Improve food security and promote sustainable practices.',
    scope: 'Establishment of garden plots, training workshops, and community outreach.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '2',
    projectName: 'Digital Literacy Program for Seniors',
    location: 'UNEFA Cagua Extension',
    responsibleDepartment: 'Systems Engineering',
    contactInformation: 'a.gonzalez@unefa.edu.ve',
    tutors: 'Prof. Ana Rodriguez',
    status: 'Planning',
    description: 'A program to teach basic computer and internet skills to senior citizens in the community.',
    projectType: 'Educational Program',
    publicObjective: 'Enhance digital inclusion for seniors.',
    scope: 'Weekly workshops, personalized assistance, and resource material development.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    projectName: 'River Cleanup Campaign',
    location: 'Turmero River Banks',
    responsibleDepartment: 'Civil Engineering & Environmental Science',
    contactInformation: 'cleanup@unefa.edu.ve',
    tutors: 'Prof. Luis Fernandez, Prof. Sofia Herrera',
    status: 'Completed',
    description: 'Organized cleanup drives along the Turmero river to remove waste and raise environmental awareness.',
    projectType: 'Environmental Conservation',
    publicObjective: 'Reduce river pollution and promote community involvement in environmental protection.',
    scope: 'Three cleanup events, waste sorting and recycling, awareness talks in local schools.',
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
      p.location.toLowerCase().includes(lowerCaseQuery)
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
