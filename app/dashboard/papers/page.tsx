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
import { RenamePaperDialog } from "../../../components/papers/RenamePaperDialog"
import { ErrorState } from "../../../components/ui/error-state"
import { Paper } from "../../../lib/types"
import { AddToProjectDialog } from "../../../components/projects/AddToProjectDialog"

export default function PapersPage() {
  const router = useRouter()
  const { papers, totalPapersCount, viewMode, isLoading, error, refresh, deletePaper, toggleFavorite, renamePaper } = usePapers()
  
  // Dialog state
  const [paperToDelete, setPaperToDelete] = React.useState<Paper | null>(null)
  const [paperToRename, setPaperToRename] = React.useState<Paper | null>(null)
  const [addingPaper, setAddingPaper] = React.useState<{ id: string; title: string } | null>(null)

  // Handlers for PaperActions
  const handleOpen = (id: string) => router.push(`/dashboard/papers/${id}`)
  const handleFavorite = (id: string) => {
    const paper = papers.find(p => p.id === id)
    if (paper) toggleFavorite(id, !paper.isFavorite)
  }
  const handleRename = (id: string) => {
    const paper = papers.find(p => p.id === id)
    if (paper) setPaperToRename(paper)
  }
  const handleCompare = (id: string) => {}
  const handleAddToProject = (id: string) => {
    const paper = papers.find(p => p.id === id)
    if (paper) setAddingPaper({ id: paper.id, title: paper.title })
  }
  
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
                onAddToProject={handleAddToProject}
              />
            ) : (
              <PaperList 
                papers={papers} 
                onOpen={handleOpen}
                onFavorite={handleFavorite}
                onDelete={(id) => setPaperToDelete(papers.find(p => p.id === id) || null)}
                onRename={handleRename}
                onCompare={handleCompare}
                onAddToProject={handleAddToProject}
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
      
      <RenamePaperDialog
        isOpen={!!paperToRename}
        onClose={() => setPaperToRename(null)}
        onRename={async (newName) => {
          if (paperToRename) {
            await renamePaper(paperToRename.id, newName)
          }
        }}
        currentName={paperToRename?.title || ""}
      />

      {addingPaper && (
        <AddToProjectDialog
          isOpen={!!addingPaper}
          onClose={() => setAddingPaper(null)}
          paperId={addingPaper.id}
          paperTitle={addingPaper.title}
          onSuccess={refresh}
        />
      )}
    </div>
  )
}
