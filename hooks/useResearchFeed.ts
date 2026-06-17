import { useQuery } from "@tanstack/react-query";
import { ResearchFeedService } from "../services/research-feed.service";

export const useResearchFeed = (projectId: string) => {
  return useQuery({
    queryKey: ["research-feed", projectId],
    queryFn: () => ResearchFeedService.getProjectFeed(projectId),
    enabled: !!projectId,
  });
};
