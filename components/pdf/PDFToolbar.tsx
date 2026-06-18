import * as React from "react";
import { Button } from "../ui/button";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { usePDFSearch } from "../../hooks/usePDFSearch";
import { PDFNavigation } from "./PDFNavigation";
import { PDFZoom } from "./PDFZoom";
import { PanelLeft, PanelRight } from "lucide-react";

export function PDFToolbar() {
  const { toggleLeftSidebar, toggleRightSidebar } = usePDFNavigation();

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 gap-2">
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleLeftSidebar} title="Toggle sidebar" aria-label="Toggle left sidebar">
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Navigation + Zoom */}
      <div className="flex items-center gap-4">
        <PDFNavigation />
        <div className="h-5 w-px bg-border hidden sm:block" />
        <div className="hidden sm:block">
          <PDFZoom />
        </div>
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
