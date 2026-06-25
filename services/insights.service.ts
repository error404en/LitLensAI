import { orchestrator } from "../lib/ai/orchestrator/AIOrchestrator";
import { InsightsRepository } from "../lib/repositories/insights.repository";

export type InsightType = 
  | "novel_contributions" 
  | "research_trends" 
  | "common_themes" 
  | "open_questions" 
  | "methodologies" 
  | "datasets" 
  | "limitations" 
  | "future_work";

export interface ProjectInsight {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  isPinned: boolean;
  isSaved: boolean;
  updatedAt: string;
}

export const InsightsService = {
  async generateInsight(projectId: string, type: InsightType, userId: string): Promise<string> {
    const instructions: Record<InsightType, string> = {
      novel_contributions: "Identify the most novel contributions across all papers in this project.",
      research_trends: "Summarize the overarching research trends present in the literature.",
      common_themes: "Extract the common themes and recurring concepts among the papers.",
      open_questions: "List the open questions and unresolved problems identified by the authors.",
      methodologies: "Compare and summarize the different methodologies used.",
      datasets: "List all datasets utilized in the research and how they were applied.",
      limitations: "Synthesize the limitations discussed across the literature.",
      future_work: "Identify the primary directions for future work proposed by the authors."
    };

    const response = await orchestrator.execute("Summarize", {
      projectId,
      userId,
      query: instructions[type],
    });

    const resultText = typeof response === "string" ? response : JSON.stringify(response);
    
    // Auto-save the insight to the repository
    await InsightsRepository.saveInsight(projectId, type, resultText);

    return resultText;
  },

  async getInsights(projectId: string): Promise<ProjectInsight[]> {
    return InsightsRepository.getInsights(projectId);
  },

  async saveInsight(projectId: string, insightId: string): Promise<void> {
    // insightId is not explicitly handled for raw saves since we use types, but we'll leave the interface
  },

  async pinInsight(_projectId: string, _insightId: string): Promise<void> {
    // Pinning requires schema support in notes, defaulting to no-op
  }
};
