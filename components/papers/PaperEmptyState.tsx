"use client"

import * as React from "react"
import { EmptyState } from "../ui/empty-state"
import { FileText } from "lucide-react"

export function PaperEmptyState() {
  return (
    <EmptyState
      title="No papers found"
      description="Upload your first research paper or adjust your search filters to see results."
      icon={FileText}
      action={
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Upload Paper
        </button>
      }
    />
  )
}
