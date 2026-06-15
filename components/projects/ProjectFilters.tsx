"use client"

import * as React from "react"
import { useProjects } from "../../hooks/useProjects"
import { Select } from "../ui/select"
import { ProjectStatus } from "../../lib/types"

export function ProjectFilters() {
  const { statusFilter, isFavoriteFilter, setStatusFilter, setIsFavoriteFilter } = useProjects()

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
        aria-label="Filter by status"
        className="w-full sm:w-[140px]"
      >
        <option value="all">All Projects</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </Select>

      <Select 
        value={String(isFavoriteFilter)} 
        onChange={(e) => {
          const val = e.target.value
          setIsFavoriteFilter(val === "all" ? "all" : val === "true")
        }}
        aria-label="Filter by favorites"
        className="w-full sm:w-[120px]"
      >
        <option value="all">All Items</option>
        <option value="true">Favorites</option>
      </Select>
    </div>
  )
}
