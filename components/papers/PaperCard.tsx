import * as React from "react"
import { Paper } from "../../lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { PaperStatusBadge } from "./PaperStatusBadge"
import { formatAuthors, formatDate } from "../../lib/utils"
import { Calendar, Heart } from "lucide-react"
import { PaperTags } from "./PaperTags"
import { PaperCardActions } from "./PaperCardActions"
import { useProjects } from "../../hooks/useProjects"

interface PaperCardProps {
  paper: Paper
  onDelete?: (id: string) => void
  onFavorite?: (id: string) => void
  onOpen?: (id: string) => void
  onRename?: (id: string) => void
  onCompare?: (id: string) => void
  onAddToProject?: (id: string) => void
}

export function PaperCard({ paper, onDelete, onFavorite, onOpen, onRename, onCompare, onAddToProject }: PaperCardProps) {
  const { projects } = useProjects()
  
  const projectName = React.useMemo(() => {
    if (!paper.projectId) return null
    return projects.find(p => p.id === paper.projectId)?.title || null
  }, [projects, paper.projectId])

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open if they didn't click inside the actions menu
    onOpen?.(paper.id)
  }

  return (
    <Card 
      className="group flex flex-col h-full hover:border-primary/50 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(paper.id)
        }
      }}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-4">
        <div className="flex flex-col space-y-2 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <PaperStatusBadge status={paper.status} />
            {paper.isFavorite && (
              <Heart className="h-4 w-4 fill-red-500 text-red-500 shrink-0" aria-label="Favorited" />
            )}
            {projectName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20" title={`Project: ${projectName}`}>
                <span className="material-symbols-outlined text-[12px]">folder</span>
                <span className="truncate max-w-[80px]">{projectName}</span>
              </span>
            )}
          </div>
          <h3 
            className="font-semibold leading-tight text-lg line-clamp-2 group-hover:text-primary transition-colors"
            title={paper.title}
          >
            {paper.title}
          </h3>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mt-1 -mr-2">
          <PaperCardActions 
            paper={paper} 
            onOpen={onOpen}
            onFavorite={onFavorite}
            onDelete={onDelete}
            onRename={onRename}
            onCompare={onCompare}
            onAddToProject={onAddToProject}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="text-sm font-medium text-foreground mb-3 line-clamp-1" title={formatAuthors(paper.authors)}>
          {formatAuthors(paper.authors)}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.summary?.abstract || paper.abstract}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4 text-xs text-muted-foreground">
        <PaperTags tags={paper.tags} maxTags={3} />
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2" title={`Journal: ${paper.journal || 'Unknown'}`}>
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">{paper.journal || 'Unknown Journal'} • {paper.year}</span>
          </div>
          <div title={`Uploaded: ${formatDate(paper.uploadedAt)}`}>
            {formatDate(paper.uploadedAt)}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
