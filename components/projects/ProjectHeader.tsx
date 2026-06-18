import * as React from "react"
import { Project } from "../../lib/types"
import { useProject } from "../../hooks/useProject"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import { ArrowLeft, Edit2, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProjectHeader({ project }: { project: Project }) {
  const router = useRouter()
  const { updateProject } = useProject(project.id)

  return (
    <div className="px-4 sm:px-8 py-6 pb-4 flex flex-col gap-4">
      <button 
        onClick={() => router.push('/dashboard/projects')}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground w-fit transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Workspace
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <ProjectStatusBadge status={project.status} aiStatus={project.stats?.aiStatus} />
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {project.title}
          </h1>
          <button 
            onClick={() => updateProject({ isFavorite: !project.isFavorite })}
            className="rounded-md p-1.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={project.isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <Heart className={`h-5 w-5 transition-colors ${project.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
          <button 
            onClick={async () => {
              const newTitle = prompt("Enter new project title:", project.title)
              if (newTitle && newTitle !== project.title) {
                await updateProject({ title: newTitle })
              }
            }}
            className="rounded-md p-1.5 hover:bg-accent text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Rename project"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>
    </div>
  )
}
