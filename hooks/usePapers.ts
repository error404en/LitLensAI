import { useEffect, useMemo, useCallback } from "react"
import { usePaperStore } from "../stores/paper.store"
import { getPapers } from "../lib/api"
import { Paper } from "../lib/types"

export function usePapers(projectId?: string) {
  const store = usePaperStore()

  const fetchPapers = useCallback(async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await getPapers(projectId)
      store.setPapers(data)
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to fetch papers")
    } finally {
      store.setLoading(false)
    }
  }, [projectId, store])

  // Initial fetch
  useEffect(() => {
    fetchPapers()
  }, [fetchPapers])

  // Derived state (filtering and sorting)
  const filteredAndSortedPapers = useMemo(() => {
    let result = [...store.papers]

    // 1. Status Filter
    if (store.statusFilter !== "all") {
      result = result.filter((p) => p.status === store.statusFilter)
    }

    // 2. Tag Filter
    if (store.tagFilter) {
      result = result.filter((p) => p.tags.includes(store.tagFilter as string))
    }

    // 3. Search Query
    if (store.searchQuery.trim()) {
      const query = store.searchQuery.toLowerCase().trim()
      result = result.filter((p) => 
        p.title.toLowerCase().includes(query) || 
        p.abstract.toLowerCase().includes(query) ||
        p.authors.some(a => a.name.toLowerCase().includes(query))
      )
    }

    // 4. Sort
    result.sort((a, b) => {
      if (store.sortBy === "year") {
        return b.year - a.year
      }
      if (store.sortBy === "alphabetical") {
        return a.title.localeCompare(b.title)
      }
      // default: recent (uploadedAt)
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

    return result
  }, [store.papers, store.statusFilter, store.tagFilter, store.searchQuery, store.sortBy])

  return {
    // Data
    papers: store.papers,
    filteredPapers: filteredAndSortedPapers,
    isLoading: store.isLoading,
    error: store.error,
    
    // Filters State
    searchQuery: store.searchQuery,
    statusFilter: store.statusFilter,
    tagFilter: store.tagFilter,
    sortBy: store.sortBy,

    // Actions
    setSearchQuery: store.setSearchQuery,
    setStatusFilter: store.setStatusFilter,
    setTagFilter: store.setTagFilter,
    setSortBy: store.setSortBy,
    refresh: fetchPapers,
  }
}
