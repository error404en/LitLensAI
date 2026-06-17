import { useQuery } from "@tanstack/react-query";
import { ActionCenterService } from "../services/action-center.service";

export const useActionCenter = (projectId: string) => {
  return useQuery({
    queryKey: ["action-center", projectId],
    queryFn: () => ActionCenterService.getActionContext(projectId),
    enabled: !!projectId,
  });
};
