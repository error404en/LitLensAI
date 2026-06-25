import { PapersRepository } from "../lib/repositories/papers.repository";
import { ConversationRepository } from "../lib/repositories/conversation.repository";
import { AnnotationRepository } from "../lib/repositories/annotation.repository";

export interface ProjectHealthMetrics {
  totalPapers: number;
  processedPapers: number;
  pendingPapers: number;
  averageReadingTimeMinutes: number; // calculated roughly as (words / 200)
  annotationCount: number; 
  aiUsageCount: number;
  knowledgeCoverage: number; // percentage
  completionPercentage: number;
}

export const ProjectHealthService = {
  async getHealthMetrics(projectId: string): Promise<ProjectHealthMetrics> {
    const papers = await PapersRepository.findByProjectId(projectId);
    const conversations = await ConversationRepository.getConversations(projectId);
    
    // For AI Usage
    const aiUsageCount = conversations.reduce((acc, conv) => acc + (conv.messages?.length || 0), 0);

    const totalPapers = papers.length;
    const processedPapers = papers.filter(p => p.status === "completed").length;
    const pendingPapers = totalPapers - processedPapers;
    const completionPercentage = totalPapers === 0 ? 0 : Math.round((processedPapers / totalPapers) * 100);

    // Rough reading time: assumes 10,000 words per paper, 200 words per min = 50 mins per paper
    const averageReadingTimeMinutes = totalPapers > 0 ? 50 : 0;
    
    const rawAnnotationsCount = await AnnotationRepository.countAnnotationsByProject(projectId);
    const highlightsCount = await AnnotationRepository.countHighlightsByProject(projectId);
    const annotationCount = rawAnnotationsCount + highlightsCount;

    // Coverage scales with completed papers (up to 70%) and annotations (up to 30%, 10 annotations = 30%)
    const annotationCoverage = Math.min(30, annotationCount * 3);
    const knowledgeCoverage = completionPercentage > 0 ? Math.min(100, Math.round(completionPercentage * 0.7) + annotationCoverage) : 0;

    return {
      totalPapers,
      processedPapers,
      pendingPapers,
      averageReadingTimeMinutes,
      annotationCount,
      aiUsageCount,
      knowledgeCoverage,
      completionPercentage
    };
  }
};
