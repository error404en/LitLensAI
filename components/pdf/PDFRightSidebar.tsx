import * as React from "react";
import { PDFHighlights } from "./PDFHighlights";
import { PDFAnnotationPanel } from "./PDFAnnotationPanel";
import { PDFCitationPanel } from "./PDFCitationPanel";
import { ChatPanel } from "../ai/ChatPanel";
import { RightSidebarTab, PDFHighlight } from "../../lib/types/pdf";
import { Paper } from "../../lib/types";
import { cn } from "../../lib/utils";
import { Highlighter, StickyNote, Quote, Sparkles } from "lucide-react";

const TABS: { id: RightSidebarTab; label: string; icon: React.ElementType }[] = [
  { id: "highlights", label: "Highlights", icon: Highlighter },
  { id: "annotations", label: "Notes", icon: StickyNote },
  { id: "citation", label: "Cite", icon: Quote },
  { id: "ai", label: "AI Copilot", icon: Sparkles },
];

interface PDFRightSidebarProps {
  activeTab: RightSidebarTab;
  onTabChange: (tab: RightSidebarTab) => void;
  highlights: readonly PDFHighlight[];
  onRemoveHighlight?: (id: string) => void;
  paper: Paper;
}

export function PDFRightSidebar({ activeTab, onTabChange, highlights, onRemoveHighlight, paper }: PDFRightSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors border-b-2",
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              title={tab.label}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col">
        {activeTab === "highlights" && <PDFHighlights highlights={highlights} onRemove={onRemoveHighlight} />}
        {activeTab === "annotations" && <PDFAnnotationPanel />}
        {activeTab === "citation" && <PDFCitationPanel paper={paper} />}
        {activeTab === "ai" && <ChatPanel paperId={paper.id} onClose={() => onTabChange("highlights")} />}
      </div>
    </div>
  );
}
