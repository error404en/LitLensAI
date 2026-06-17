import { useQuery } from "@tanstack/react-query";
import { ProgressService } from "../services/progress.service";

export const useResearchProgress = (projectId: string) => {
  return useQuery({
    queryKey: ["research-progress", projectId],
    queryFn: () => ProgressService.getProgress(projectId),
    enabled: !!projectId,
  });
};
