import { ProjectsRepository } from "../lib/repositories/projects.repository";
import { PapersRepository } from "../lib/repositories/papers.repository";
import { Project, ProjectActivity, ProjectStats, Paper } from "../lib/types";
import { CreateProjectSchema, UpdateProjectSchema } from "../lib/validations/project.schema";

export const ProjectsService = {
  async getProjects(): Promise<Project[]> {
    try {
      const projects = await ProjectsRepository.findAll();
      // Hydrate stats for each project
      const hydrated = await Promise.all(projects.map(async (p) => {
        const stats = await this.getProjectStats(p.id);
        return { ...p, stats };
      }));
      return hydrated;
    } catch (error) {
      console.error("ProjectsService.getProjects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  async getProject(id: string): Promise<Project> {
    try {
      const project = await ProjectsRepository.findById(id);
      if (!project) throw new Error("Project not found");
      return project;
    } catch (error: any) {
      console.error("ProjectsService.getProject:", error);
      if (error?.message === "Project not found") {
        throw error;
      }
      throw new Error("Failed to fetch project details");
    }
  },

  async createProject(title: string, description?: string, isFavorite?: boolean): Promise<Project> {
    try {
      const { createProjectAction } = await import("../app/actions/ai.actions");
      const data = await createProjectAction(title, description);
      
      // Need to map the data to the Project type since the action returns raw row
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        status: "active",
        isFavorite: false,
        createdAt: data.created_at,
        updatedAt: data.created_at,
      } as Project;
    } catch (error) {
      console.error("ProjectsService.createProject:", error);
      throw error;
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const validatedUpdates = UpdateProjectSchema.parse(updates);
      return await ProjectsRepository.update(id, validatedUpdates);
    } catch (error) {
      console.error("ProjectsService.updateProject:", error);
      throw new Error("Failed to update project");
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await ProjectsRepository.delete(id);
    } catch (error) {
      console.error("ProjectsService.deleteProject:", error);
      throw new Error("Failed to delete project");
    }
  },

  async archiveProject(id: string): Promise<Project> {
    try {
      return await ProjectsRepository.archive(id);
    } catch (error) {
      console.error("ProjectsService.archiveProject:", error);
      throw new Error("Failed to archive project");
    }
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<Project> {
    try {
      return await ProjectsRepository.favorite(id, isFavorite);
    } catch (error) {
      console.error("ProjectsService.toggleFavorite:", error);
      throw new Error("Failed to update favorite status");
    }
  },

  async getAttachedPapers(projectId: string): Promise<Paper[]> {
    return PapersRepository.findByProjectId(projectId);
  },

  async attachPaper(projectId: string, paperId: string): Promise<void> {
    await ProjectsRepository.addActivity({
      projectId,
      type: "paper_added",
      description: `Attached paper to project`
    });
  },

  async detachPaper(projectId: string, paperId: string): Promise<void> {
    await ProjectsRepository.addActivity({
      projectId,
      type: "paper_removed",
      description: `Removed paper from project`
    });
  },

  // Stats and Activity
  async getProjectStats(projectId: string): Promise<ProjectStats> {
    try {
      const papers = await this.getAttachedPapers(projectId);
      const activities = await ProjectsRepository.getActivities(projectId);
      
      const completed = papers.filter(p => p.status === "completed").length;
      const completionPercentage = papers.length === 0 ? 0 : Math.round((completed / papers.length) * 100);

      const processing = papers.some(p => p.status === "processing" || p.status === "summarizing" || p.status === "embedding");
      
      return {
        paperCount: papers.length,
        completionPercentage,
        aiStatus: processing ? "processing" : "ready",
        activityCount: activities.length,
      };
    } catch (error) {
      console.error("ProjectsService.getProjectStats:", error);
      throw new Error("Failed to fetch project stats");
    }
  },

  async getProjectActivity(projectId: string): Promise<ProjectActivity[]> {
    try {
      return await ProjectsRepository.getActivities(projectId);
    } catch (error) {
      console.error("ProjectsService.getProjectActivity:", error);
      throw new Error("Failed to fetch project activity");
    }
  }
};
