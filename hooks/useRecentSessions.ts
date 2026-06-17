import { useQuery } from "@tanstack/react-query";
import { ConversationRepository } from "../lib/repositories/conversation.repository";

export const useRecentSessions = (projectId: string) => {
  return useQuery({
    queryKey: ["recent-sessions", projectId],
    queryFn: () => ConversationRepository.getConversations(projectId),
    enabled: !!projectId,
  });
};
