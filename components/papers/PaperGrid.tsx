import * as React from "react"
import { Paper } from "../../lib/types"
import { PaperCard } from "./PaperCard"

interface PaperGridProps {
  papers: readonly Paper[]
  onDelete?: (id: string) => void
  onFavorite?: (id: string) => void
  onOpen?: (id: string) => void
  onRename?: (id: string) => void
  onCompare?: (id: string) => void
}

export function PaperGrid({ papers, onDelete, onFavorite, onOpen, onRename, onCompare }: PaperGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          onOpen={onOpen}
          onDelete={onDelete}
          onFavorite={onFavorite}
          onRename={onRename}
          onCompare={onCompare}
        />
      ))}
    </div>
  )
}
