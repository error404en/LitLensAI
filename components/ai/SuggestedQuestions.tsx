import * as React from "react";
import { useSuggestedQuestions } from "../../hooks/useSuggestedQuestions";
import { Sparkles, ArrowRight } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const { suggestions } = useSuggestedQuestions();

  if (!suggestions.length) return null;

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.prompt)}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card text-left text-sm transition-all hover:bg-accent hover:border-primary/30 group"
          >
            <div className="flex-1">
              <span className="font-medium">{s.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.prompt}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
