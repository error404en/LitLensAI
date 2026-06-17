import { ConversationRepository } from "../lib/repositories/conversation.repository";
import { PapersRepository } from "../lib/repositories/papers.repository";

export interface ActionCenterData {
  lastOpenedPaperId: string | null;
  lastConversationId: string | null;
  pendingComparisons: number;
  unreadPapers: number;
}

export const ActionCenterService = {
  async getActionContext(projectId: string): Promise<ActionCenterData> {
    const papers = await PapersRepository.findByProjectId(projectId);
    const conversations = await ConversationRepository.getConversations(projectId);

    const lastOpenedPaperId = papers.length > 0 ? papers[0].id : null;
    const lastConversationId = conversations.length > 0 ? conversations[0].id : null;
    const unreadPapers = papers.length; // Mock

    return {
      lastOpenedPaperId,
      lastConversationId,
      pendingComparisons: 0,
      unreadPapers
    };
  }
};
