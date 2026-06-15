"use client"

import * as React from "react"
import { useProjects } from "../../hooks/useProjects"
import { ProjectSearch } from "./ProjectSearch"
import { ProjectFilters } from "./ProjectFilters"
import { ProjectSort } from "./ProjectSort"
import { LayoutGrid, List, Plus } from "lucide-react"
import { cn } from "../../lib/utils"

interface ProjectToolbarProps {
  onCreateClick?: () => void;
}

export function ProjectToolbar({ onCreateClick }: ProjectToolbarProps) {
  const { viewMode, setViewMode, activeCount, archivedCount } = useProjects()

  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <ProjectSearch />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-sm font-medium text-muted-foreground mr-2 hidden lg:block">
            {activeCount} Active • {archivedCount} Archived
          </div>
          <button 
            onClick={onCreateClick}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <ProjectFilters />
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <ProjectSort />
          
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
