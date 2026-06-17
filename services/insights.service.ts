import { AIOrchestrator } from "../lib/ai/orchestrator/AIOrchestrator";

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
    const orchestrator = AIOrchestrator.getInstance();
    
    // We construct a specific instruction based on the insight type
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

    const response = await orchestrator.execute({
      feature: "summarize",
      projectId,
      userId,
      input: instructions[type],
    });

    return response.content;
  },

  async getInsights(_projectId: string): Promise<ProjectInsight[]> {
    // For now, return placeholders. In production, this would fetch saved/cached insights from a database repository
    return [];
  },

  async saveInsight(_projectId: string, _insightId: string): Promise<void> {
    // Implement save logic via a future repository
  },

  async pinInsight(_projectId: string, _insightId: string): Promise<void> {
    // Implement pin logic via a future repository
  }
};
