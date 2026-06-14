import { Paper, Project } from "./types";
import { MOCK_PAPERS, MOCK_PROJECTS } from "./mock-data";

/**
 * Simulates network delay for mock API calls
 */
const delay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getPapers(projectId?: string): Promise<Paper[]> {
  await delay();
  if (projectId) {
    return MOCK_PAPERS.filter((paper) => paper.projectId === projectId);
  }
  return [...MOCK_PAPERS];
}

export async function getPaperById(id: string): Promise<Paper | null> {
  await delay();
  const paper = MOCK_PAPERS.find((p) => p.id === id);
  return paper || null;
}

export async function createPaper(paper: Omit<Paper, "id" | "createdAt" | "updatedAt">): Promise<Paper> {
  await delay(1000);
  const newPaper: Paper = {
    ...paper,
    id: `paper_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // In a real app, this would persist to a database
  return newPaper;
}

export async function deletePaper(id: string): Promise<boolean> {
  await delay();
  // Simulate successful deletion
  return true;
}

export async function getProjects(): Promise<Project[]> {
  await delay();
  return [...MOCK_PROJECTS];
}

export async function getProjectById(id: string): Promise<Project | null> {
  await delay();
  const project = MOCK_PROJECTS.find((p) => p.id === id);
  return project || null;
}

export async function createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
  await delay(1000);
  const newProject: Project = {
    ...project,
    id: `proj_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // In a real app, this would persist to a database
  return newProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  await delay();
  // Simulate successful deletion
  return true;
}