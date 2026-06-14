import * as React from "react"
import { Paper } from "../../lib/types"
import { PaperCard } from "./PaperCard"

interface PaperGridProps {
  papers: readonly Paper[]
}

export function PaperGrid({ papers }: PaperGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          onOpen={(id) => console.log("Open", id)}
          onDelete={(id) => console.log("Delete", id)}
          onFavorite={(id) => console.log("Favorite", id)}
        />
      ))}
    </div>
  )
}
