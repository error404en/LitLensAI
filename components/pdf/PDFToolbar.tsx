import * as React from "react";
import { Button } from "../ui/button";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { usePDFSearch } from "../../hooks/usePDFSearch";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, PanelLeft, PanelRight, Search, Bookmark, Maximize } from "lucide-react";
import { cn } from "../../lib/utils";

export function PDFToolbar() {
  const { currentPage, totalPages, zoom, zoomIn, zoomOut, fitWidth, nextPage, prevPage, goToPage, toggleLeftSidebar, toggleRightSidebar } = usePDFNavigation();
  const [pageInput, setPageInput] = React.useState(String(currentPage));

  React.useEffect(() => { setPageInput(String(currentPage)); }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p)) goToPage(p);
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 gap-2">
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleLeftSidebar} title="Toggle sidebar" aria-label="Toggle left sidebar">
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Navigation + Zoom */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={prevPage} disabled={currentPage <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5">
          <input
            value={pageInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPageInput(e.target.value)}
            className="w-12 h-7 text-center text-sm border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Page number"
          />
          <span className="text-xs text-muted-foreground">/ {totalPages}</span>
        </form>
        <Button variant="ghost" size="icon" onClick={nextPage} disabled={currentPage >= totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        <Button variant="ghost" size="icon" onClick={zoomOut} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
        <span className="text-xs font-medium tabular-nums w-12 text-center">{zoom}%</span>
        <Button variant="ghost" size="icon" onClick={zoomIn} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={fitWidth} className="text-xs hidden sm:inline-flex">Fit Width</Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleRightSidebar} title="Toggle annotations" aria-label="Toggle right sidebar">
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
