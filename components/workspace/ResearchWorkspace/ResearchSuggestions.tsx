import { Sparkles, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SuggestionService } from "../../../../services/suggestion.service";

interface ResearchSuggestionsProps {
  projectId: string;
}

export function ResearchSuggestions({ projectId }: ResearchSuggestionsProps) {
  const { data: suggestions } = useQuery({
    queryKey: ["research-suggestions", projectId],
    queryFn: () => SuggestionService.getSuggestions(projectId),
    enabled: !!projectId,
  });

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h2 className="font-semibold text-lg">Smart Suggestions</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-surface border rounded-xl p-5 flex flex-col h-full">
            <h4 className="font-medium text-sm mb-2">{suggestion.title}</h4>
            <p className="text-xs text-muted-foreground flex-1 mb-4">
              {suggestion.description}
            </p>
            <button className="flex items-center justify-center w-full py-2 text-xs font-medium bg-background border rounded-lg hover:bg-muted transition-colors group">
              {suggestion.actionLabel}
              <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
