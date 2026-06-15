import * as React from "react";
import { Sparkles } from "lucide-react";
import { SuggestedQuestions } from "./SuggestedQuestions";

export function AIWelcome({ onSelectSuggestion }: { onSelectSuggestion: (prompt: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 pb-4 flex flex-col items-center text-center animate-in fade-in duration-500">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">How can I help?</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
          I can analyze this paper, answer specific questions, or help you understand complex concepts.
        </p>
      </div>
      <SuggestedQuestions onSelect={onSelectSuggestion} />
    </div>
  );
}
