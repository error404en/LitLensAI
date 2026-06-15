import * as React from "react"
import { Project } from "../../lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import { ProjectCardActions } from "./ProjectCardActions"
import { formatDate } from "../../lib/utils"
import { FileText, Activity, Heart } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onOpen?: (id: string) => void
  onFavorite?: (id: string, isFav: boolean) => void
  onRename?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProjectCard({ project, onOpen, onFavorite, onRename, onArchive, onDelete }: ProjectCardProps) {
  const stats = project.stats || { paperCount: 0, completionPercentage: 0, aiStatus: "idle", activityCount: 0 }

  return (
    <Card 
      className="group flex flex-col h-full hover:border-primary/50 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => onOpen?.(project.id)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(project.id)
        }
      }}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-4">
        <div className="flex flex-col space-y-2 flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <ProjectStatusBadge status={project.status} aiStatus={stats.aiStatus} />
            {project.isFavorite && (
              <Heart className="h-4 w-4 fill-red-500 text-red-500 shrink-0" aria-label="Favorited" />
            )}
          </div>
          <h3 
            className="font-semibold leading-tight text-xl line-clamp-2 group-hover:text-primary transition-colors"
            title={project.title}
          >
            {project.title}
          </h3>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mt-1 -mr-2">
          <ProjectCardActions 
            project={project} 
            onOpen={onOpen}
            onFavorite={onFavorite}
            onRename={onRename}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[40px]">
          {project.description || "No description provided."}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Completion</span>
            <span>{stats.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out" 
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Papers Attached">
              <FileText className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{stats.paperCount}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Timeline Activities">
              <Activity className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{stats.activityCount}</span>
            </div>
          </div>
          <div title={`Updated: ${formatDate(project.updatedAt)}`}>
            {formatDate(project.updatedAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
