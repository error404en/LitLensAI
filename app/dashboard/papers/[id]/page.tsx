"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { usePDF } from "../../../../hooks/usePDF";
import { usePDFAnnotations } from "../../../../hooks/usePDFAnnotations";
import { usePapers } from "../../../../hooks/usePapers";
import { PDFToolbar } from "../../../../components/pdf/PDFToolbar";
import { PDFSidebar } from "../../../../components/pdf/PDFSidebar";
import { PDFRightSidebar } from "../../../../components/pdf/PDFRightSidebar";
import { PDFViewer } from "../../../../components/pdf/PDFViewer";
import { PDFStatusBar } from "../../../../components/pdf/PDFStatusBar";
import { PDFLoading } from "../../../../components/pdf/PDFLoading";
import { PDFError } from "../../../../components/pdf/PDFError";
import { PDFSelectionMenu } from "../../../../components/pdf/PDFSelectionMenu";
import { PDFSidebarTab, RightSidebarTab } from "../../../../lib/types/pdf";
import { Button } from "../../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "../../../../lib/utils";

export default function PDFWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const {
    isLoading: isPDFLoading,
    error: pdfError,
    outline,
    leftSidebarTab,
    rightSidebarTab,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    selectedText,
    setSelectedText,
  } = usePDF(id);

  const { highlights, addHighlight, removeHighlight, addAnnotation } = usePDFAnnotations();
  const { papers, isLoading: isPapersLoading } = usePapers();
  
  const paper = React.useMemo(() => papers.find(p => p.id === id), [papers, id]);

  const { setLeftSidebarTab, setRightSidebarTab } = usePDF(id);

  // Handle mock text selection for demonstration
  React.useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        // Find nearest PDF page
        const pageEl = (e.target as HTMLElement).closest('[id^="pdf-page-"]');
        let pageNum = 1;
        if (pageEl) {
          const idParts = pageEl.id.split('-');
          pageNum = parseInt(idParts[idParts.length - 1], 10) || 1;
        }

        setSelectedText({
          text,
          page: pageNum,
          position: { x: e.clientX, y: e.clientY - 40 }
        });
      } else if (!((e.target as HTMLElement).closest('.fixed.z-50'))) {
        setSelectedText(null);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [setSelectedText]);

  if (isPDFLoading || isPapersLoading) {
    return <PDFLoading />;
  }

  if (pdfError || !paper) {
    return <PDFError message={pdfError || "Paper not found"} />;
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-border bg-card shrink-0">
        <Link href={`/dashboard/projects/${paper.projectId}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate" title={paper.title}>{paper.title}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate">
            <span>{paper.authors.map(a => a.name).join(", ")}</span>
            <span>•</span>
            <span>{paper.journal || "Unknown Journal"} ({paper.year})</span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <PDFToolbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {isLeftSidebarOpen && (
          <aside className="w-64 border-r border-border bg-card shrink-0 flex flex-col hidden md:flex">
            <PDFSidebar 
              activeTab={leftSidebarTab as PDFSidebarTab} 
              onTabChange={(tab) => setLeftSidebarTab(tab)} 
              outline={outline} 
            />
          </aside>
        )}

        {/* Center PDF Viewer */}
        <main className="flex-1 relative flex flex-col bg-muted/20 overflow-hidden">
          <PDFViewer />
          
          {/* Floating Selection Menu */}
          {selectedText && (
            <PDFSelectionMenu
              x={selectedText.position.x}
              y={selectedText.position.y}
              selectedText={selectedText.text}
              onHighlight={(color) => {
                addHighlight(selectedText.page, selectedText.text, color, 0, selectedText.text.length);
              }}
              onAddNote={() => {
                // In a real app, this might open a specific dialog or focus the right sidebar
                setRightSidebarTab("annotations");
                setSelectedText(null);
              }}
              onCopy={() => {
                navigator.clipboard.writeText(selectedText.text);
                setSelectedText(null);
              }}
              onCopyCitation={() => {
                // Mock citation copy
                navigator.clipboard.writeText(`"${selectedText.text}" (${paper.authors[0]?.name || "Unknown"} et al., ${paper.year})`);
                setSelectedText(null);
              }}
              onAskAI={() => {
                setRightSidebarTab("ai" as RightSidebarTab);
                setSelectedText(null);
              }}
              onClose={() => setSelectedText(null)}
            />
          )}
        </main>

        {/* Right Sidebar */}
        {isRightSidebarOpen && (
          <aside className={cn(
            "border-l border-border bg-card shrink-0 flex flex-col hidden lg:flex transition-all duration-300 ease-in-out",
            rightSidebarTab === "ai" ? "w-[600px] xl:w-[800px]" : "w-72"
          )}>
            <PDFRightSidebar
              activeTab={rightSidebarTab as RightSidebarTab}
              onTabChange={(tab) => setRightSidebarTab(tab)}
              highlights={highlights}
              onRemoveHighlight={removeHighlight}
              paper={paper}
            />
          </aside>
        )}
      </div>

      {/* Status Bar */}
      <PDFStatusBar />
    </div>
  );
}
