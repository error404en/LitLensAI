"use client"

import * as React from "react"
import { EmptyState } from "../ui/empty-state"
import { FolderOpen } from "lucide-react"

export function ProjectEmptyState({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      title="No projects found"
      description="Create a project to start organizing your research papers and generating literature reviews."
      icon={FolderOpen}
      action={
        <button 
          onClick={onCreateClick}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Project
        </button>
      }
    />
  )
}
