import * as React from "react";
import { PDFOutlineItem as OutlineItemType } from "../../lib/types/pdf";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { cn } from "../../lib/utils";
import { ChevronRight } from "lucide-react";

function OutlineItem({ item, depth = 0 }: { item: OutlineItemType; depth?: number }) {
  const { currentPage, goToPage } = usePDFNavigation();
  const isActive = currentPage === item.page;

  return (
    <button
      onClick={() => goToPage(item.page)}
      className={cn(
        "w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors truncate flex items-center gap-1.5",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-primary/10 text-primary font-medium"
      )}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
      title={item.title}
    >
      {item.level > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />}
      <span className="truncate">{item.title}</span>
      <span className="ml-auto text-xs text-muted-foreground shrink-0 tabular-nums">{item.page}</span>
    </button>
  );
}

export function PDFOutline({ outline }: { outline: readonly OutlineItemType[] }) {
  return (
    <nav className="flex flex-col gap-0.5 p-2" aria-label="Document outline">
      {outline.map((item) => (
        <OutlineItem key={item.id} item={item} depth={item.level} />
      ))}
    </nav>
  );
}
