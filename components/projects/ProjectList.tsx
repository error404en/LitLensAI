import * as React from "react"
import { Project } from "../../lib/types"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import { ProjectCardActions } from "./ProjectCardActions"
import { formatDate } from "../../lib/utils"
import { FileText, Heart } from "lucide-react"

interface ProjectListProps {
  projects: readonly Project[]
  onOpen?: (id: string) => void
  onFavorite?: (id: string, isFav: boolean) => void
  onRename?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProjectList({ projects, ...actions }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => {
        const stats = project.stats || { paperCount: 0, completionPercentage: 0, aiStatus: "idle", activityCount: 0 }
        
        return (
          <div 
            key={project.id}
            onClick={() => actions.onOpen?.(project.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                actions.onOpen?.(project.id)
              }
            }}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          >
            {/* Left Section: Status & Title & Description */}
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <ProjectStatusBadge status={project.status} aiStatus={stats.aiStatus} />
                {project.isFavorite && (
                  <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 shrink-0" aria-label="Favorited" />
                )}
              </div>
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors" title={project.title}>
                {project.title}
              </h3>
              <div className="text-sm text-muted-foreground truncate" title={project.description}>
                {project.description || "No description provided."}
              </div>
            </div>
            
            {/* Middle Section: Progress Bar */}
            <div className="hidden md:flex flex-col gap-1.5 w-32 shrink-0 px-4">
              <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                <span>Completion</span>
                <span>{stats.completionPercentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-in-out" 
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Right Section: Stats & Date & Actions */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0 mt-2 sm:mt-0">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground" title={`${stats.paperCount} Papers`}>
                <FileText className="h-4 w-4" />
                <span className="font-medium text-foreground">{stats.paperCount}</span>
              </div>
              <div className="hidden lg:block w-32 text-right text-xs text-muted-foreground truncate">
                 {formatDate(project.updatedAt)}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <ProjectCardActions project={project} {...actions} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
