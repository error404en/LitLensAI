import * as React from "react"
import { Dropdown, DropdownItem } from "../ui/dropdown"
import { MoreVertical, FolderOpen, Heart, Pencil, Archive, Trash, RotateCcw } from "lucide-react"
import { Project } from "../../lib/types"

interface ProjectCardActionsProps {
  project: Project
  onOpen?: (id: string) => void
  onFavorite?: (id: string, isFav: boolean) => void
  onRename?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProjectCardActions({ project, onOpen, onFavorite, onRename, onArchive, onDelete }: ProjectCardActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open project menu"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      }
    >
      <DropdownItem onClick={() => { onOpen?.(project.id); setIsOpen(false) }}>
        <FolderOpen className="mr-2 h-4 w-4" /> Open Project
      </DropdownItem>
      <DropdownItem onClick={() => { onFavorite?.(project.id, !project.isFavorite); setIsOpen(false) }}>
        <Heart className={`mr-2 h-4 w-4 ${project.isFavorite ? 'fill-red-500 text-red-500' : ''}`} /> 
        {project.isFavorite ? 'Unfavorite' : 'Favorite'}
      </DropdownItem>
      <DropdownItem onClick={() => { onRename?.(project.id); setIsOpen(false) }}>
        <Pencil className="mr-2 h-4 w-4" /> Rename
      </DropdownItem>
      
      {project.status === "archived" ? (
        <DropdownItem onClick={() => { onArchive?.(project.id); setIsOpen(false) }}>
          <RotateCcw className="mr-2 h-4 w-4" /> Restore
        </DropdownItem>
      ) : (
        <DropdownItem onClick={() => { onArchive?.(project.id); setIsOpen(false) }}>
          <Archive className="mr-2 h-4 w-4" /> Archive
        </DropdownItem>
      )}

      <div className="h-px bg-border my-1 mx-1" />
      <DropdownItem 
        className="text-destructive focus:text-destructive" 
        onClick={() => { onDelete?.(project.id); setIsOpen(false) }}
      >
        <Trash className="mr-2 h-4 w-4" /> Delete
      </DropdownItem>
    </Dropdown>
  )
}
