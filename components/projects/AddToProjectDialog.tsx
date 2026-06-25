import * as React from "react"
import { Dialog } from "../ui/dialog"
import { useProjects } from "../../hooks/useProjects"
import { PapersService } from "../../services/papers.service"

interface AddToProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  paperId: string
  paperTitle: string
  onSuccess?: () => void
}

export function AddToProjectDialog({ isOpen, onClose, paperId, paperTitle, onSuccess }: AddToProjectDialogProps) {
  const { projects, isLoading } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const activeProjects = React.useMemo(() => {
    return projects.filter(p => p.status === "active")
  }, [projects])

  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setSelectedProjectId("")
      setError(null)
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProjectId) return
    setIsSubmitting(true)
    setError(null)
    try {
      await PapersService.updatePaper(paperId, { projectId: selectedProjectId })
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to associate paper with project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add to Project" 
      description={`Select a project to associate with "${paperTitle}".`}
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="project" className="text-sm font-medium text-foreground">
            Project
          </label>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading projects...</div>
          ) : activeProjects.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md text-center">
              No active projects found. Please create a project first.
            </div>
          ) : (
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="" disabled>Select a project...</option>
              {activeProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          )}
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
            disabled={isSubmitting || !selectedProjectId}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add to Project"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
