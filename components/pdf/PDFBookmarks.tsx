import * as React from "react";
import { usePDFAnnotations } from "../../hooks/usePDFAnnotations";
import { usePDFNavigation } from "../../hooks/usePDFNavigation";
import { Button } from "../ui/button";
import { Bookmark as BookmarkIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function PDFBookmarks() {
  const { bookmarks, addBookmark, removeBookmark } = usePDFAnnotations();
  const { currentPage, goToPage } = usePDFNavigation();

  const isCurrentBookmarked = bookmarks.some((b) => b.page === currentPage);

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Bookmarks</h3>
        <Button
          variant="ghost" size="sm"
          onClick={() => addBookmark(currentPage, `Page ${currentPage}`)}
          disabled={isCurrentBookmarked}
          className="text-xs"
        >
          <Plus className="mr-1 h-3 w-3" /> Bookmark Page
        </Button>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No bookmarks yet. Click above to add one.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className={cn(
                "flex items-center justify-between gap-2 p-2 rounded-md text-sm cursor-pointer transition-colors hover:bg-accent group",
                currentPage === bm.page && "bg-primary/10 text-primary"
              )}
              onClick={() => goToPage(bm.page)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <BookmarkIcon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{bm.label || `Page ${bm.page}`}</span>
              </div>
              <Button
                variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); removeBookmark(bm.id); }}
                aria-label="Remove bookmark"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
