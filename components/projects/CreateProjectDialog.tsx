import * as React from "react"
import { Dialog } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface CreateProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description: string, isFavorite: boolean) => Promise<void>
}

export function CreateProjectDialog({ isOpen, onClose, onSubmit }: CreateProjectDialogProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setIsFavorite(false)
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title is required.")
      return
    }
    if (title.length > 50) {
      setError("Title must be 50 characters or less.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(title.trim(), description.trim(), isFavorite)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Organize a new literature review or research topic."
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Project Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Quantum Computing Review"
            autoFocus
            disabled={isSubmitting}
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe the goal of this research project..."
            disabled={isSubmitting}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="favorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="favorite" className="text-sm font-medium text-foreground cursor-pointer">
            Mark as favorite
          </label>
        </div>

        <div className="mt-6 flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
