import { ProjectsService } from "./projects.service";
import { PapersRepository } from "../lib/repositories/papers.repository";
import { Project } from "../lib/types";

export interface WorkspaceOverview {
  project: Project;
  totalPapers: number;
  unreadPapers: number;
  lastOpenedPaperId: string | null;
}

export const WorkspaceService = {
  async getWorkspaceOverview(projectId: string): Promise<WorkspaceOverview> {
    const project = await ProjectsService.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    const papers = await PapersRepository.findByProjectId(projectId);
    
    // In a real app, lastOpenedPaperId would be stored in a user_project_preferences table
    const unreadPapers = papers.filter(p => !p.embeddingCreated).length;
    const lastOpenedPaperId = papers.length > 0 ? papers[0].id : null;

    return {
      project,
      totalPapers: papers.length,
      unreadPapers,
      lastOpenedPaperId
    };
  },

  async searchWorkspace(_projectId: string, _query: string) {
    // Stub for global workspace search across papers, notes, insights
    return {
      results: []
    };
  }
};
