import * as React from "react"
import { useRouter } from "next/navigation"
import { usePapers } from "../../hooks/usePapers"
import { PaperList } from "../papers/PaperList"
import { PaperSkeleton } from "../papers/PaperSkeleton"
import { PaperEmptyState } from "../papers/PaperEmptyState"
import { AddPaperDialog } from "./AddPaperDialog"
import { Button } from "../ui/button"
import { ConfirmDialog } from "../ui/confirm-dialog"

export function ProjectPaperList({ projectId }: { projectId: string }) {
  const { papers, isLoading, refresh, toggleFavorite } = usePapers(projectId)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [paperToDetach, setPaperToDetach] = React.useState<string | null>(null)
  const router = useRouter()

  const handleAdd = async (ids: string[]) => {
    const { PapersService } = await import("../../services/papers.service")
    await Promise.all(ids.map(id => PapersService.updatePaper(id, { projectId })))
    refresh()
  }

  const handleDetachClick = (id: string) => {
    setPaperToDetach(id)
  }

  const handleDetachConfirm = async () => {
    if (paperToDetach) {
      const { PapersService } = await import("../../services/papers.service")
      await PapersService.updatePaper(paperToDetach, { projectId: null as unknown as string })
      refresh()
      setPaperToDetach(null)
    }
  }

  if (isLoading) {
    return <PaperSkeleton viewMode="list" />
  }

  if (papers.length === 0) {
    return (
      <div className="max-w-xl mx-auto pt-12">
        <PaperEmptyState />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setIsAddOpen(true)}>Attach Paper</Button>
        </div>
        <AddPaperDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} projectId={projectId} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Attached Papers ({papers.length})</h2>
        <Button onClick={() => setIsAddOpen(true)}>Attach Paper</Button>
      </div>
      <PaperList 
        papers={papers} 
        onOpen={(id) => router.push(`/dashboard/papers/${id}`)}
        onDelete={handleDetachClick}
        onFavorite={(id) => {
          const p = papers.find(x => x.id === id)
          if (p) toggleFavorite(id, !p.isFavorite)
        }}
      />
      <AddPaperDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} projectId={projectId} />
      
      <ConfirmDialog 
        isOpen={!!paperToDetach}
        onClose={() => setPaperToDetach(null)}
        onConfirm={handleDetachConfirm}
        title="Detach Paper"
        description="Are you sure you want to detach this paper from the project? It will remain in your general library."
        confirmText="Detach"
        isDestructive={true}
      />
    </div>
  )
}
