import { useQuery } from "@tanstack/react-query";
import { IntelligenceService } from "../services/intelligence.service";

export const useProjectIntelligence = (projectId: string) => {
  return useQuery({
    queryKey: ["project-intelligence", projectId],
    queryFn: () => IntelligenceService.getProjectIntelligence(projectId),
    enabled: !!projectId,
  });
};
