"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useProjects } from "../../../../hooks/useProjects"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { ArrowLeft } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const { createProject } = useProjects()
  
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const p = await createProject(title.trim(), description.trim(), isFavorite)
      router.push(`/dashboard/projects/${p.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-8 pt-8">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/dashboard/projects')}
        className="-ml-3 mb-6 text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new workspace to organize related research papers and notes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6 shadow-sm">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Project Name <span className="text-destructive">*</span></label>
          <Input
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="e.g., Transformer Models Review"
            autoFocus
            disabled={isSubmitting}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Briefly describe the goal of this project..."
            disabled={isSubmitting}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="favorite"
            checked={isFavorite}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsFavorite(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="favorite" className="text-sm font-medium cursor-pointer">
            Mark as favorite project
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end gap-2 border-t mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/projects')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Workspace"}
          </Button>
        </div>
      </form>
    </div>
  )
}
