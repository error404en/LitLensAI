import * as React from "react"
import { Dialog } from "../ui/dialog"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  isDestructive?: boolean
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmText, isDestructive }: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-primary-foreground ${
            isDestructive 
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Dialog>
  )
}
