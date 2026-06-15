import * as React from "react"
import { Dialog } from "../ui/dialog"
import { Button } from "../ui/button"

interface RenameProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newName: string) => Promise<void>
  currentName: string
}

export function RenameProjectDialog({ isOpen, onClose, onRename, currentName }: RenameProjectDialogProps) {
  const [name, setName] = React.useState(currentName)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setName(currentName)
    }
  }, [isOpen, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || name === currentName) return
    setIsSubmitting(true)
    try {
      await onRename(name.trim())
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Rename Project" description="Enter a new name for your project.">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-2">
          <input
            autoFocus
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            maxLength={100}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || !name.trim() || name === currentName}>
            {isSubmitting ? "Renaming..." : "Rename"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
