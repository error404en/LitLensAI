import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { PaperList } from "../papers/PaperList"
import { PaperSkeleton } from "../papers/PaperSkeleton"
import { PaperEmptyState } from "../papers/PaperEmptyState"
import { AddPaperDialog } from "./AddPaperDialog"
import { Button } from "../ui/button"

export function ProjectPaperList({ projectId }: { projectId: string }) {
  const { papers, isLoading } = usePapers(projectId)
  const [isAddOpen, setIsAddOpen] = React.useState(false)

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
        <AddPaperDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={async (ids) => { console.log(ids) }} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Attached Papers ({papers.length})</h2>
        <Button onClick={() => setIsAddOpen(true)}>Attach Paper</Button>
      </div>
      <PaperList papers={papers} />
      <AddPaperDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={async (ids) => { console.log(ids) }} />
    </div>
  )
}
