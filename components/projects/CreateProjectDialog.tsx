import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { CreateProjectSchema } from "../../lib/validations/project.schema"

type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>

interface CreateProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description: string, isFavorite: boolean) => Promise<void>
}

export function CreateProjectDialog({ isOpen, onClose, onSubmit }: CreateProjectDialogProps) {
  const [error, setError] = React.useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      isFavorite: false,
    },
  })

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      reset()
      setError(null)
    }
  }, [isOpen, reset])

  const onFormSubmit = async (data: CreateProjectFormValues) => {
    setError(null)
    try {
      await onSubmit(data.title.trim(), data.description?.trim() || "", data.isFavorite || false)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Organize a new literature review or research topic."
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
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
            placeholder="e.g., Quantum Computing Review"
            autoFocus
            disabled={isSubmitting}
            maxLength={100}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Briefly describe the goal of this research project..."
            disabled={isSubmitting}
            rows={3}
            className="resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="favorite"
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            {...register("isFavorite")}
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
