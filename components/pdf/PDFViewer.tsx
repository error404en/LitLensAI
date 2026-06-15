import * as React from "react";
import { PDFPage } from "./PDFPage";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";

export function PDFViewer() {
  const { currentPage, totalPages, zoom, goToPage } = usePDFNavigation();

  // Render a window of pages for virtualization-readiness
  const visiblePages = React.useMemo(() => {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 2);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-8 flex flex-col items-center gap-6 scroll-smooth">
      {visiblePages.map((page) => (
        <PDFPage key={page} pageNumber={page} zoom={zoom} isActive={page === currentPage} onSelect={() => goToPage(page)} />
      ))}
    </div>
  );
}
