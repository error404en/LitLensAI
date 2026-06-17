import { ProjectsRepository } from "../lib/repositories/projects.repository";
import { ProjectActivity } from "../lib/types";

export const ResearchFeedService = {
  async getProjectFeed(projectId: string): Promise<ProjectActivity[]> {
    return ProjectsRepository.getActivities(projectId);
  },

  async logEvent(projectId: string, type: ProjectActivity["type"], description: string): Promise<ProjectActivity> {
    return ProjectsRepository.addActivity({
      projectId,
      type,
      description
    });
  }
};
