import * as React from "react"
import { Dialog } from "../ui/dialog"
import { Button } from "../ui/button"
import { usePapers } from "../../hooks/usePapers"

interface AddPaperDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (paperIds: string[]) => Promise<void>
}

export function AddPaperDialog({ isOpen, onClose, onAdd }: AddPaperDialogProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) setSelectedIds([])
  }

  const { papers, isLoading } = usePapers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIds.length === 0) return
    setIsSubmitting(true)
    try {
      await onAdd(selectedIds)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePaper = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Attach Papers" description="Select papers from your library to attach to this project.">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto border rounded-md p-4 flex flex-col gap-2">
          {isLoading ? (
            <div className="text-center text-muted-foreground p-4">Loading papers...</div>
          ) : papers.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">No papers available to attach.</div>
          ) : (
            papers.map(paper => (
              <label key={paper.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer border">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(paper.id)}
                  onChange={() => togglePaper(paper.id)}
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-sm font-medium truncate">{paper.title}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {paper.authors?.map(a => a.name).join(', ')} • {paper.year}
                  </span>
                </div>
              </label>
            ))
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || selectedIds.length === 0}>
            {isSubmitting ? "Attaching..." : "Attach Papers"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
