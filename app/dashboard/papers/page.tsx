"use client"

import * as React from "react"
import { usePapers } from "../../../hooks/usePapers"
import { PaperGrid } from "../../../components/papers/PaperGrid"
import { PaperSearch } from "../../../components/papers/PaperSearch"
import { PaperFilters } from "../../../components/papers/PaperFilters"
import { PaperActions } from "../../../components/papers/PaperActions"
import { PaperSkeleton } from "../../../components/papers/PaperSkeleton"
import { PaperEmptyState } from "../../../components/papers/PaperEmptyState"
import { ErrorState } from "../../../components/ui/error-state"

export default function PapersPage() {
  const { filteredPapers, isLoading, error, refresh } = usePapers()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Papers Library</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage, search, and analyze your uploaded research documents.
          </p>
        </div>
        <PaperActions />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <PaperSearch />
        <PaperFilters />
      </div>

      <div className="mt-8">
        {isLoading && filteredPapers.length === 0 ? (
          <PaperSkeleton />
        ) : error ? (
          <ErrorState 
            title="Failed to load papers" 
            description={error} 
            onRetry={refresh} 
          />
        ) : filteredPapers.length === 0 ? (
          <PaperEmptyState />
        ) : (
          <PaperGrid papers={filteredPapers} />
        )}
      </div>
    </div>
  )
}
