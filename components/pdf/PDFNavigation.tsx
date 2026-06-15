import * as React from "react";
import { Button } from "../ui/button";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export function PDFNavigation() {
  const { currentPage, totalPages, nextPage, prevPage, firstPage, lastPage } = usePDFNavigation();

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={firstPage} disabled={currentPage <= 1} aria-label="First page" className="h-8 w-8">
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={prevPage} disabled={currentPage <= 1} aria-label="Previous page" className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs font-medium tabular-nums px-2">{currentPage} / {totalPages}</span>
      <Button variant="ghost" size="icon" onClick={nextPage} disabled={currentPage >= totalPages} aria-label="Next page" className="h-8 w-8">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={lastPage} disabled={currentPage >= totalPages} aria-label="Last page" className="h-8 w-8">
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
