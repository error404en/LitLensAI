"use client"

import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { Select } from "../ui/select"
import { PaperStatus } from "../../lib/types"

export function PaperFilters() {
  const { statusFilter, isFavoriteFilter, setStatusFilter, setIsFavoriteFilter } = usePapers()

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value as PaperStatus | "all")}
        aria-label="Filter by status"
        className="w-full sm:w-[140px]"
      >
        <option value="all">All Statuses</option>
        <option value="completed">Ready</option>
        <option value="processing">Processing</option>
        <option value="embedding">Embedding</option>
        <option value="summarizing">Summarizing</option>
        <option value="failed">Failed</option>
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
