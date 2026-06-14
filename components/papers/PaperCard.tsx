import * as React from "react"
import { Paper } from "../../lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { PaperStatusBadge } from "./PaperStatusBadge"
import { formatAuthors, formatDate, truncateText } from "../../lib/utils"
import { Calendar, FileText, MoreVertical, Trash, Heart } from "lucide-react"
import { Dropdown, DropdownItem } from "../ui/dropdown"

interface PaperCardProps {
  paper: Paper
  onDelete?: (id: string) => void
  onFavorite?: (id: string) => void
  onOpen?: (id: string) => void
}

export function PaperCard({ paper, onDelete, onFavorite, onOpen }: PaperCardProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <PaperStatusBadge status={paper.status} />
          <h3 
            className="font-semibold leading-tight mt-2 line-clamp-2 cursor-pointer hover:underline"
            onClick={() => onOpen?.(paper.id)}
          >
            {paper.title}
          </h3>
        </div>
        <Dropdown
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          trigger={
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => { onOpen?.(paper.id); setDropdownOpen(false) }}>
            <FileText className="mr-2 h-4 w-4" /> Open
          </DropdownItem>
          <DropdownItem onClick={() => { onFavorite?.(paper.id); setDropdownOpen(false) }}>
            <Heart className="mr-2 h-4 w-4" /> Favorite
          </DropdownItem>
          <DropdownItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => { onDelete?.(paper.id); setDropdownOpen(false) }}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownItem>
        </Dropdown>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="text-sm text-muted-foreground mb-4">
          {formatAuthors(paper.authors)}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.summary?.abstract || paper.abstract}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1">
          {paper.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-secondary px-2 py-0.5 rounded-full text-[10px] font-medium">
              {tag}
            </span>
          ))}
          {paper.tags.length > 3 && (
            <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px] font-medium">
              +{paper.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {paper.year}
          </div>
          <div>{formatDate(paper.uploadedAt)}</div>
        </div>
      </CardFooter>
    </Card>
  )
}
