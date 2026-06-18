"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const { papers, totalPapersCount, viewMode, isLoading, error, refresh, deletePaper, toggleFavorite, renamePaper } = usePapers()
  
  // Dialog state
  const [paperToDelete, setPaperToDelete] = React.useState<Paper | null>(null)

  // Handlers for PaperActions
  const handleOpen = (id: string) => router.push(`/dashboard/papers/${id}`)
  const handleFavorite = (id: string) => {
    const paper = papers.find(p => p.id === id)
    if (paper) toggleFavorite(id, !paper.isFavorite)
  }
  const handleRename = async (id: string) => {
    const newTitle = prompt("Enter new title:")
    if (newTitle) {
      await renamePaper(id, newTitle)
    }
  }
  const handleCompare = (id: string) => console.log("Comparison not fully implemented, id:", id)
  
  const handleDeleteConfirm = async (id: string) => {
    await deletePaper(id)
    setPaperToDelete(null)
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
