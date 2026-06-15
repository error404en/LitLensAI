import * as React from "react";
import { Sparkles } from "lucide-react";

export function AIEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">AI Research Copilot</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
        Ask questions, generate summaries, or extract key insights from this paper.
      </p>
    </div>
  );
}
