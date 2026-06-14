"use client"

import * as React from "react"
import { usePapers } from "../../../hooks/usePapers"
import { PaperGrid } from "../../../components/papers/PaperGrid"
import { PaperList } from "../../../components/papers/PaperList"
import { PaperToolbar } from "../../../components/papers/PaperToolbar"
import { PaperSkeleton } from "../../../components/papers/PaperSkeleton"
import { PaperEmptyState } from "../../../components/papers/PaperEmptyState"
import { PaperPagination } from "../../../components/papers/PaperPagination"
import { DeletePaperDialog } from "../../../components/papers/DeletePaperDialog"
import { ErrorState } from "../../../components/ui/error-state"
import { Paper } from "../../../lib/types"

export default function PapersPage() {
  const { papers, totalPapersCount, viewMode, isLoading, error, refresh } = usePapers()
  
  // Dialog state
  const [paperToDelete, setPaperToDelete] = React.useState<Paper | null>(null)

  // Handlers for PaperActions
  const handleOpen = (id: string) => console.log("Navigate to paper:", id)
  const handleFavorite = (id: string) => console.log("Toggle favorite for:", id)
  const handleRename = (id: string) => console.log("Rename paper:", id)
  const handleCompare = (id: string) => console.log("Add to comparison:", id)
  
  const handleDeleteConfirm = (id: string) => {
    console.log("Deleting paper:", id)
    // Here you would call api.deletePaper(id) and then refresh()
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Papers Library</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage, search, and analyze your uploaded research documents.
        </p>
      </div>

      <PaperToolbar />

      <div className="mt-4 min-h-[400px]">
        {isLoading && papers.length === 0 ? (
          <PaperSkeleton viewMode={viewMode} />
        ) : error ? (
          <ErrorState 
            title="Failed to load papers" 
            description={error} 
            onRetry={refresh} 
          />
        ) : totalPapersCount === 0 ? (
          <PaperEmptyState />
        ) : (
          <div className="animate-in fade-in-50 duration-500">
            {viewMode === "grid" ? (
              <PaperGrid 
                papers={papers} 
                onOpen={handleOpen}
                onFavorite={handleFavorite}
                onDelete={(id) => setPaperToDelete(papers.find(p => p.id === id) || null)}
                onRename={handleRename}
                onCompare={handleCompare}
              />
            ) : (
              <PaperList 
                papers={papers} 
                onOpen={handleOpen}
                onFavorite={handleFavorite}
                onDelete={(id) => setPaperToDelete(papers.find(p => p.id === id) || null)}
                onRename={handleRename}
                onCompare={handleCompare}
              />
            )}
            <PaperPagination />
          </div>
        )}
      </div>

      <DeletePaperDialog
        paper={paperToDelete}
        isOpen={!!paperToDelete}
        onClose={() => setPaperToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
