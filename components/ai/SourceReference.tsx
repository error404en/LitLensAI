import * as React from "react";
import { AICitation } from "../../lib/types/ai";
import { FileText, Link as LinkIcon } from "lucide-react";

interface SourceReferenceProps {
  citation: AICitation;
  onClick?: () => void;
}

export function SourceReference({ citation, onClick }: SourceReferenceProps) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-1.5 p-3 rounded-lg border bg-card text-left transition-colors hover:bg-accent cursor-pointer group"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="truncate">{citation.paperTitle}</span>
        {citation.page && <span className="shrink-0 text-muted-foreground">p. {citation.page}</span>}
      </div>
      {citation.exactQuote && (
        <p className="text-xs text-muted-foreground line-clamp-2 italic border-l-2 pl-2 ml-1">
          &ldquo;{citation.exactQuote}&rdquo;
        </p>
      )}
      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <LinkIcon className="h-3 w-3" />
        <span>Open source</span>
      </div>
    </div>
  );
}
