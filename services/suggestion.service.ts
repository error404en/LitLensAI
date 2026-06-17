// unused

export interface ResearchSuggestion {
  id: string;
  type: "read_next" | "compare" | "generate_review" | "find_contradictions" | "continue_annotation";
  title: string;
  description: string;
  actionLabel: string;
}

export const SuggestionService = {
  async getSuggestions(_projectId: string): Promise<ResearchSuggestion[]> {
    // In production, this would ask AIOrchestrator to evaluate the project state 
    // and generate dynamic next-step suggestions. For now, we return heuristics.
    return [
      {
        id: "sug-1",
        type: "read_next",
        title: "Read Next Paper",
        description: "You have unread papers that are fully processed and ready.",
        actionLabel: "Start Reading"
      },
      {
        id: "sug-2",
        type: "compare",
        title: "Compare Latest Studies",
        description: "You recently added two papers with similar methodologies.",
        actionLabel: "Run Comparison"
      },
      {
        id: "sug-3",
        type: "find_contradictions",
        title: "Find Contradictions",
        description: "Let AI scan your library for conflicting results.",
        actionLabel: "Analyze Gaps"
      }
    ];
  }
};
