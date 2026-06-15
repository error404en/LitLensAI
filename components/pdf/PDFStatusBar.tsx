import * as React from "react";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";

export function PDFStatusBar() {
  const { currentPage, totalPages, zoom, readingProgress } = usePDFNavigation();

  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-muted/30 text-xs text-muted-foreground shrink-0">
      <div className="flex items-center gap-4">
        <span>Page <strong className="text-foreground">{currentPage}</strong> of {totalPages}</span>
        <span className="hidden sm:inline">Zoom: <strong className="text-foreground">{zoom}%</strong></span>
        <span className="hidden md:inline">Words: ~12,450</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">Reading: <strong className="text-foreground">{readingProgress}%</strong></span>
        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${readingProgress}%` }} />
        </div>
      </div>
    </div>
  );
}
