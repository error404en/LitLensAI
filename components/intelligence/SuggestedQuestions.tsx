import { Sparkles, ArrowRight } from "lucide-react";

export function SuggestedQuestions() {
  const suggestions = [
    "Summarize the overarching project goal",
    "Find common methodologies",
    "What are the research gaps?",
    "Compare the latest two papers",
  ];

  return (
    <div className="bg-surface border rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <h3 className="font-semibold text-sm">Suggested Questions</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((q, i) => (
          <button 
            key={i}
            className="w-full flex items-center justify-between p-2 text-sm text-left rounded-md hover:bg-muted transition-colors group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate pr-2">
              {q}
            </span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
