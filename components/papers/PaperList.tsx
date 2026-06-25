import * as React from "react"
import { Paper } from "../../lib/types"
import { PaperStatusBadge } from "./PaperStatusBadge"
import { PaperCardActions } from "./PaperCardActions"
import { formatAuthors, formatDate } from "../../lib/utils"
import { Calendar, Heart } from "lucide-react"
import { PaperTags } from "./PaperTags"
import { useProjects } from "../../hooks/useProjects"

interface PaperListProps {
  papers: readonly Paper[]
  onDelete?: (id: string) => void
  onFavorite?: (id: string) => void
  onOpen?: (id: string) => void
  onRename?: (id: string) => void
  onCompare?: (id: string) => void
  onAddToProject?: (id: string) => void
}

export function PaperList({ papers, onDelete, onFavorite, onOpen, onRename, onCompare, onAddToProject }: PaperListProps) {
  const { projects } = useProjects()

  return (
    <div className="flex flex-col gap-3">
      {papers.map((paper) => {
        const projectName = paper.projectId 
          ? projects.find(p => p.id === paper.projectId)?.title 
          : null;

        return (
          <div 
            key={paper.id}
            onClick={() => onOpen?.(paper.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen?.(paper.id)
              }
            }}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          >
            {/* Left Section: Status & Title & Authors */}
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <PaperStatusBadge status={paper.status} />
                {paper.isFavorite && (
                  <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 shrink-0" aria-label="Favorited" />
                )}
              </div>
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors" title={paper.title}>
                {paper.title}
              </h3>
              <div className="text-sm text-muted-foreground truncate" title={formatAuthors(paper.authors)}>
                {formatAuthors(paper.authors)} • {paper.journal || 'Unknown Journal'} ({paper.year})
              </div>
            </div>
            
            {/* Right Section: Project, Tags & Date & Actions */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0 mt-2 sm:mt-0">
              <div className="hidden md:block w-40" onClick={(e) => e.stopPropagation()}>
                {projectName ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20" title={`Project: ${projectName}`}>
                    <span className="material-symbols-outlined text-[14px]">folder</span>
                    <span className="truncate max-w-[120px]">{projectName}</span>
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddToProject?.(paper.id);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary border border-dashed text-muted-foreground transition-colors cursor-pointer font-sans"
                  >
                    <span className="material-symbols-outlined text-[14px]">create_new_folder</span>
                    Add to Project
                  </button>
                )}
              </div>

              <div className="hidden lg:block w-48 text-right text-xs text-muted-foreground truncate">
                 Added {formatDate(paper.uploadedAt)}
              </div>
              <div className="hidden md:flex justify-end w-40">
                <PaperTags tags={paper.tags} maxTags={2} />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
