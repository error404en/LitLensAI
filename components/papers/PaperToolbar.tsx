"use client"

import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { PaperSearch } from "./PaperSearch"
import { PaperFilters } from "./PaperFilters"
import { PaperSort } from "./PaperSort"
import { PaperActions } from "./PaperActions"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "../../lib/utils"

export function PaperToolbar() {
  const { viewMode, setViewMode, totalPapersCount } = usePapers()

  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <PaperSearch />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-sm font-medium text-muted-foreground mr-2 hidden lg:block">
            {totalPapersCount} {totalPapersCount === 1 ? 'paper' : 'papers'}
          </div>
          <PaperActions />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <PaperFilters />
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <PaperSort />
          
          {/* View Toggle */}
          <div className="flex items-center rounded-md border border-input p-1 bg-muted/50 hidden sm:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
              aria-label="List view"
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
