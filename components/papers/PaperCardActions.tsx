import * as React from "react"
import { Dropdown, DropdownItem } from "../ui/dropdown"
import { MoreVertical, FileText, Heart, Pencil, Trash, GitCompare } from "lucide-react"
import { Paper } from "../../lib/types"

interface PaperCardActionsProps {
  paper: Paper
  onOpen?: (id: string) => void
  onFavorite?: (id: string) => void
  onDelete?: (id: string) => void
  onRename?: (id: string) => void
  onCompare?: (id: string) => void
}

export function PaperCardActions({ paper, onOpen, onFavorite, onDelete, onRename, onCompare }: PaperCardActionsProps) {
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
          aria-label="Open paper menu"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      }
    >
      <DropdownItem onClick={() => { onOpen?.(paper.id); setIsOpen(false) }}>
        <FileText className="mr-2 h-4 w-4" /> Open
      </DropdownItem>
      <DropdownItem onClick={() => { onFavorite?.(paper.id); setIsOpen(false) }}>
        <Heart className={`mr-2 h-4 w-4 ${paper.isFavorite ? 'fill-red-500 text-red-500' : ''}`} /> 
        {paper.isFavorite ? 'Unfavorite' : 'Favorite'}
      </DropdownItem>
      <DropdownItem onClick={() => { onRename?.(paper.id); setIsOpen(false) }}>
        <Pencil className="mr-2 h-4 w-4" /> Rename
      </DropdownItem>
      <DropdownItem onClick={() => { onCompare?.(paper.id); setIsOpen(false) }}>
        <GitCompare className="mr-2 h-4 w-4" /> Compare
      </DropdownItem>
      <div className="h-px bg-border my-1 mx-1" />
      <DropdownItem 
        className="text-destructive focus:text-destructive" 
        onClick={() => { onDelete?.(paper.id); setIsOpen(false) }}
      >
        <Trash className="mr-2 h-4 w-4" /> Delete
      </DropdownItem>
    </Dropdown>
  )
}
