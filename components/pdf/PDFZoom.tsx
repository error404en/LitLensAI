import * as React from "react";
import { Button } from "../ui/button";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";

export function PDFZoom() {
  const { zoom, zoomIn, zoomOut, fitWidth, fitPage } = usePDFNavigation();

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={zoomOut} aria-label="Zoom out" className="h-8 w-8">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-xs font-medium tabular-nums w-12 text-center">{zoom}%</span>
      <Button variant="ghost" size="icon" onClick={zoomIn} aria-label="Zoom in" className="h-8 w-8">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={fitWidth} title="Fit width" aria-label="Fit width" className="h-8 w-8">
        <Maximize2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={fitPage} title="Fit page" aria-label="Fit page" className="h-8 w-8">
        <Minimize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
