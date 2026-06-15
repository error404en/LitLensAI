import * as React from "react"
import { Project } from "../../lib/types"
import { ProjectCard } from "./ProjectCard"

interface ProjectGridProps {
  projects: readonly Project[]
  onOpen?: (id: string) => void
  onFavorite?: (id: string, isFav: boolean) => void
  onRename?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProjectGrid({ projects, ...actions }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          {...actions}
        />
      ))}
    </div>
  )
}
