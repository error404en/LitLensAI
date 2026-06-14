"use client"

import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { Select } from "../ui/select"
import { PaperStatus } from "../../lib/types"

export function PaperFilters() {
  const { statusFilter, sortBy, setStatusFilter, setSortBy } = usePapers()

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full sm:w-48">
        <Select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as PaperStatus | "all")}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Ready</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <Select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as "year" | "alphabetical" | "recent")}
          aria-label="Sort by"
        >
          <option value="recent">Recently Uploaded</option>
          <option value="year">Publication Year</option>
          <option value="alphabetical">Alphabetical</option>
        </Select>
      </div>
    </div>
  )
}
