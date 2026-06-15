import * as React from "react";
import { PDFOutline } from "./PDFOutline";
import { PDFBookmarks } from "./PDFBookmarks";
import { PDFSearch } from "./PDFSearch";
import { PDFAnnotationPanel } from "./PDFAnnotationPanel";
import { PDFOutlineItem, PDFSidebarTab } from "../../lib/types/pdf";
import { cn } from "../../lib/utils";
import { List, Bookmark, StickyNote, Search, Sparkles } from "lucide-react";

const TABS: { id: PDFSidebarTab; label: string; icon: React.ElementType }[] = [
  { id: "outline", label: "Outline", icon: List },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "search", label: "Search", icon: Search },
];

interface PDFSidebarProps {
  activeTab: PDFSidebarTab;
  onTabChange: (tab: PDFSidebarTab) => void;
  outline: readonly PDFOutlineItem[];
}

export function PDFSidebar({ activeTab, onTabChange, outline }: PDFSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Tab strip */}
      <div className="flex border-b border-border shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center py-2.5 text-xs transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "outline" && <PDFOutline outline={outline} />}
        {activeTab === "bookmarks" && <PDFBookmarks />}
        {activeTab === "notes" && <PDFAnnotationPanel />}
        {activeTab === "search" && <PDFSearch />}
      </div>
    </div>
  );
}
