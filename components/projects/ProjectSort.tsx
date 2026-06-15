"use client"

import * as React from "react"
import { useProjects } from "../../hooks/useProjects"
import { Select } from "../ui/select"

export function ProjectSort() {
  const { sortBy, setSortBy } = useProjects()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline-block">Sort by:</span>
      <Select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value as any)}
        aria-label="Sort projects"
        className="w-[160px]"
      >
        <option value="updated">Recently Updated</option>
        <option value="created">Recently Created</option>
        <option value="alphabetical">Alphabetical (A-Z)</option>
        <option value="paper_count">Paper Count</option>
        <option value="completion">Completion %</option>
      </Select>
    </div>
  )
}
