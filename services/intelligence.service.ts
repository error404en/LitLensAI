import { ProjectsService } from "./projects.service";
import { ProjectHealthService, ProjectHealthMetrics } from "./project-health.service";
import { Project } from "../lib/types";

export interface ProjectIntelligence {
  project: Project;
  health: ProjectHealthMetrics;
}

export const IntelligenceService = {
  async getProjectIntelligence(projectId: string): Promise<ProjectIntelligence> {
    const project = await ProjectsService.getProject(projectId);
    const health = await ProjectHealthService.getHealthMetrics(projectId);
    
    return {
      project,
      health
    };
  }
};
