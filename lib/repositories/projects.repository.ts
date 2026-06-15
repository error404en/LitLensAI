import { Project, ProjectActivity } from "../types";
import { MOCK_PROJECTS } from "../mock-data";

// In-memory store to simulate database mutations
let projectsData: Project[] = [...MOCK_PROJECTS];
let activityData: ProjectActivity[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ProjectsRepository = {
  async findAll(): Promise<Project[]> {
    await delay(300);
    return [...projectsData];
  },

  async findById(id: string): Promise<Project | null> {
    await delay(200);
    const project = projectsData.find((p) => p.id === id);
    return project ? { ...project } : null;
  },

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    await delay(400);
    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projectsData = [newProject, ...projectsData];
    
    // Add activity
    this.addActivity({
      projectId: newProject.id,
      type: "project_created",
      description: `Project "${newProject.title}" was created.`
    });

    return newProject;
  },

  async update(id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project> {
    await delay(300);
    const index = projectsData.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updatedProject = {
      ...projectsData[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    projectsData[index] = updatedProject;
    return updatedProject;
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    projectsData = projectsData.filter((p) => p.id !== id);
  },

  async archive(id: string): Promise<Project> {
    return this.update(id, { status: "archived" });
  },

  async favorite(id: string, isFavorite: boolean): Promise<Project> {
    return this.update(id, { isFavorite });
  },

  async addActivity(activity: Omit<ProjectActivity, "id" | "createdAt">): Promise<ProjectActivity> {
    const newActivity: ProjectActivity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    activityData = [newActivity, ...activityData];
    return newActivity;
  },

  async getActivities(projectId: string): Promise<ProjectActivity[]> {
    await delay(200);
    return activityData.filter(a => a.projectId === projectId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
