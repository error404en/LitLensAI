import * as React from "react";
import { Button } from "../ui/button";
import { Copy, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";

interface AIActionBarProps {
  onCopy?: () => void;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export function AIActionBar({ onCopy, onRegenerate, isLast }: AIActionBarProps) {
  return (
    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onCopy && (
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onCopy} title="Copy">
          <Copy className="h-3 w-3" />
        </Button>
      )}
      {onRegenerate && isLast && (
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onRegenerate} title="Regenerate">
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Helpful">
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" title="Not helpful">
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
}
