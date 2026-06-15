import * as React from "react";
import { PDFHighlight } from "../../lib/types/pdf";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn, formatDate } from "../../lib/utils";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";

const colorClasses: Record<string, string> = {
  yellow: "bg-yellow-200/60 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-800",
  green: "bg-green-200/60 border-green-300 dark:bg-green-900/30 dark:border-green-800",
  blue: "bg-blue-200/60 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800",
  pink: "bg-pink-200/60 border-pink-300 dark:bg-pink-900/30 dark:border-pink-800",
};

interface PDFHighlightsProps {
  highlights: readonly PDFHighlight[];
  onRemove?: (id: string) => void;
}

export function PDFHighlights({ highlights, onRemove }: PDFHighlightsProps) {
  const { goToPage } = usePDFNavigation();

  if (highlights.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-8">No highlights yet. Select text to add one.</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {highlights.map((hl) => (
        <div
          key={hl.id}
          onClick={() => goToPage(hl.page)}
          className={cn("p-3 rounded-md border cursor-pointer group transition-all hover:shadow-sm", colorClasses[hl.color])}
        >
          <p className="text-sm line-clamp-3 italic">&ldquo;{hl.text}&rdquo;</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">Page {hl.page} • {formatDate(hl.createdAt)}</span>
            <Button
              variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); onRemove?.(hl.id); }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
