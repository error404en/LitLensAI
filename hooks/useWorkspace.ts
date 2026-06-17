import { useQuery } from "@tanstack/react-query";
import { WorkspaceService } from "../services/workspace.service";

export const useWorkspace = (projectId: string) => {
  return useQuery({
    queryKey: ["workspace-overview", projectId],
    queryFn: () => WorkspaceService.getWorkspaceOverview(projectId),
    enabled: !!projectId,
  });
};
