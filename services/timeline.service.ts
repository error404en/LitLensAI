import { ProjectsRepository } from "../lib/repositories/projects.repository";
import { ProjectActivity } from "../lib/types";

export interface TimelineGroup {
  date: string;
  events: ProjectActivity[];
}

export const TimelineService = {
  async getTimeline(projectId: string): Promise<TimelineGroup[]> {
    const activities = await ProjectsRepository.getActivities(projectId);
    
    // Group activities by local date string
    const groups: Record<string, ProjectActivity[]> = {};
    
    activities.forEach(activity => {
      const dateStr = new Date(activity.createdAt).toLocaleDateString();
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(activity);
    });

    return Object.entries(groups).map(([date, events]) => ({
      date,
      events
    }));
  }
};
