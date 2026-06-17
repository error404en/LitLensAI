import { useQuery } from "@tanstack/react-query";
import { ProjectHealthService } from "../services/project-health.service";

export const useProjectHealth = (projectId: string) => {
  return useQuery({
    queryKey: ["project-health", projectId],
    queryFn: () => ProjectHealthService.getHealthMetrics(projectId),
    enabled: !!projectId,
  });
};
