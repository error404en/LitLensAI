import * as React from "react";
import { AIContext } from "../../lib/types/ai";
import { FileText, Type, X } from "lucide-react";
import { Button } from "../ui/button";

interface ContextCardProps {
  context: AIContext | null;
  onClearContext?: () => void;
}

export function ContextCard({ context, onClearContext }: ContextCardProps) {
  if (!context?.selectedText) {
    return (
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <FileText className="h-3.5 w-3.5" />
          <span>Current Document</span>
        </div>
        <p className="text-sm font-medium truncate">Ask questions about the entire paper.</p>
        <p className="text-xs text-muted-foreground mt-1">Select text in the PDF to ask specific questions.</p>
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-border bg-primary/5 relative">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1.5">
          <Type className="h-3.5 w-3.5" />
          <span>Selected Context</span>
          {context.selectedPage && <span className="font-normal opacity-70">(Page {context.selectedPage})</span>}
        </div>
        {onClearContext && (
          <Button variant="ghost" size="icon" className="h-5 w-5 -mt-1 -mr-1 hover:bg-primary/10" onClick={onClearContext}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="pl-2 border-l-2 border-primary/30">
        <p className="text-xs text-muted-foreground line-clamp-3 italic">
          &ldquo;{context.selectedText}&rdquo;
        </p>
      </div>
    </div>
  );
}
