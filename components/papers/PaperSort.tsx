"use client"

import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { Select } from "../ui/select"

export function PaperSort() {
  const { sortBy, setSortBy } = usePapers()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline-block">Sort by:</span>
      <Select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value as any)}
        aria-label="Sort papers"
        className="w-[160px]"
      >
        <option value="newest">Newest Added</option>
        <option value="oldest">Oldest Added</option>
        <option value="recent">Recently Uploaded</option>
        <option value="year">Publication Year</option>
        <option value="title-a-z">Title (A-Z)</option>
        <option value="title-z-a">Title (Z-A)</option>
      </Select>
    </div>
  )
}
