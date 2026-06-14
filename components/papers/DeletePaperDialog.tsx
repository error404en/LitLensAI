import * as React from "react"
import { Dialog } from "../ui/dialog"
import { Paper } from "../../lib/types"

interface DeletePaperDialogProps {
  paper: Paper | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function DeletePaperDialog({ paper, isOpen, onClose, onConfirm }: DeletePaperDialogProps) {
  if (!paper) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Paper"
      description="This action cannot be undone. This will permanently delete the paper and remove its data from our servers."
    >
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm(paper.id)
            onClose()
          }}
          className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
        </button>
      </div>
    </Dialog>
  )
}
