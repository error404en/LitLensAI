import * as React from "react";
import { Sparkles } from "lucide-react";

export function AIThinking() {
  return (
    <div className="flex gap-3 w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="shrink-0 mt-1">
        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
        </div>
      </div>
      <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 h-[44px]">
        <div className="flex gap-1 items-center">
          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
