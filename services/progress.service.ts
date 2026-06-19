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

    let annotationsCount = 0;
    try {
      const { PDFService } = await import("./pdf.service");
      const annotationsPromises = papers.map(p => PDFService.getAnnotations(p.id));
      const annotationsResults = await Promise.allSettled(annotationsPromises);
      annotationsCount = annotationsResults.reduce((acc, result) => {
        if (result.status === "fulfilled") return acc + result.value.length;
        return acc;
      }, 0);
    } catch (e) {
      console.error("Failed to fetch annotations for progress:", e);
    }

    return {
      papersProcessed,
      totalPapers,
      readingProgress: Math.min(100, Math.round(completionPercentage * 0.5)),
      annotationsCount,
      comparisonsCount: 0,
      reviewsCount: 0,
      completionPercentage
    };
  }
};
