import * as React from "react"
import { cn } from "../../lib/utils"

interface PaperTagsProps {
  tags: readonly string[]
  maxTags?: number
  className?: string
}

export function PaperTags({ tags, maxTags = 3, className }: PaperTagsProps) {
  if (!tags || tags.length === 0) return null

  const visibleTags = tags.slice(0, maxTags)
  const remaining = tags.length - maxTags

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground transition-colors hover:bg-secondary"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full border border-border bg-secondary/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground cursor-help" title={tags.slice(maxTags).join(", ")}>
          +{remaining}
        </span>
      )}
    </div>
  )
}
