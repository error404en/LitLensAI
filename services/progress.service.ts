import { PapersRepository } from "../lib/repositories/papers.repository";
import { ConversationRepository } from "../lib/repositories/conversation.repository";

export interface ResearchProgress {
  papersProcessed: number;
  totalPapers: number;
  readingProgress: number; // 0-100
  annotationsCount: number;
  comparisonsCount: number;
  reviewsCount: number;
  completionPercentage: number;
}

export const ProgressService = {
  async getProgress(projectId: string): Promise<ResearchProgress> {
    const papers = await PapersRepository.findByProjectId(projectId);
    const conversations = await ConversationRepository.getConversations(projectId);

    const totalPapers = papers.length;
    const papersProcessed = papers.filter(p => p.status === "completed").length;
    const completionPercentage = totalPapers === 0 ? 0 : Math.round((papersProcessed / totalPapers) * 100);

    // Mock deeper metrics
    return {
      papersProcessed,
      totalPapers,
      readingProgress: Math.min(100, Math.round(completionPercentage * 0.5)),
      annotationsCount: conversations.length * 3, // Mock
      comparisonsCount: 0, // Mock until comparisons table is queried
      reviewsCount: 0,
      completionPercentage
    };
  }
};
