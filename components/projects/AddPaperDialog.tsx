import * as React from "react"
import { Dialog } from "../ui/dialog"
import { Button } from "../ui/button"

interface AddPaperDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (paperIds: string[]) => Promise<void>
}

export function AddPaperDialog({ isOpen, onClose, onAdd }: AddPaperDialogProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) setSelectedIds([])
  }, [isOpen])

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

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Attach Papers" description="Select papers from your library to attach to this project.">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="min-h-[200px] border rounded-md p-4 flex items-center justify-center text-muted-foreground bg-muted/20">
          Paper multiselect list placeholder
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
