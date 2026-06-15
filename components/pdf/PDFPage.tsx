import * as React from "react";
import { cn } from "../../lib/utils";

interface PDFPageProps {
  pageNumber: number;
  zoom: number;
  isActive: boolean;
  onSelect?: () => void;
}

export function PDFPage({ pageNumber, zoom, isActive, onSelect }: PDFPageProps) {
  const scale = zoom / 100;

  return (
    <div
      id={`pdf-page-${pageNumber}`}
      onClick={onSelect}
      className={cn(
        "relative mx-auto bg-white dark:bg-zinc-900 shadow-lg rounded-sm overflow-hidden transition-all duration-200",
        isActive && "ring-2 ring-primary/50"
      )}
      style={{ width: `${595 * scale}px`, minHeight: `${842 * scale}px` }}
    >
      {/* Simulated PDF page content */}
      <div className="p-8 space-y-4" style={{ fontSize: `${14 * scale}px` }}>
        <div className="h-4 bg-muted/40 rounded w-3/4" />
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-5/6" />
        <div className="h-6" />
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-4/5" />
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-3/4" />
        <div className="h-6" />
        <div className="h-3 bg-muted/20 rounded w-full" />
        <div className="h-3 bg-muted/20 rounded w-full" />
        <div className="h-3 bg-muted/20 rounded w-5/6" />
        <div className="h-3 bg-muted/20 rounded w-full" />
        <div className="h-3 bg-muted/20 rounded w-2/3" />
      </div>

      {/* Page number label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border">
        {pageNumber}
      </div>
    </div>
  );
}
