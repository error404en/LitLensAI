import { useState, useEffect, useMemo, useCallback } from "react"
import { usePaperStore } from "../stores/paper.store"
import { PapersService } from "../services/papers.service"

const ITEMS_PER_PAGE = 12

export function usePapers(projectId?: string) {
  const store = usePaperStore()

  const fetchPapers = useCallback(async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await PapersService.getPapers(projectId)
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

  // 1. Derived state: Filtered
  const filteredPapers = useMemo(() => {
    let result = [...store.papers]

    // Status Filter
    if (store.statusFilter !== "all") {
      result = result.filter((p) => p.status === store.statusFilter)
    }

    // Favorite Filter
    if (store.isFavoriteFilter !== "all") {
      result = result.filter((p) => p.isFavorite === store.isFavoriteFilter)
    }

    // Tag Filter
    if (store.tagFilter) {
      result = result.filter((p) => p.tags.includes(store.tagFilter as string))
    }

    // Search Query (Multi-keyword)
    if (store.searchQuery.trim()) {
      const keywords = store.searchQuery.toLowerCase().trim().split(/\s+/)
      
      result = result.filter((p) => {
        const searchableText = [
          p.title,
          p.abstract,
          p.journal || "",
          ...p.authors.map(a => a.name),
          ...p.tags
        ].join(" ").toLowerCase()
        
        // Ensure ALL keywords exist in the searchable text
        return keywords.every(kw => searchableText.includes(kw))
      })
    }

    return result
  }, [store.papers, store.statusFilter, store.isFavoriteFilter, store.tagFilter, store.searchQuery])

  // 2. Derived state: Sorted
  const sortedPapers = useMemo(() => {
    const result = [...filteredPapers]
    
    result.sort((a, b) => {
      switch (store.sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title-a-z":
          return a.title.localeCompare(b.title)
        case "title-z-a":
          return b.title.localeCompare(a.title)
        case "year":
          return b.year - a.year
        case "recent":
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
    })

    return result
  }, [filteredPapers, store.sortBy])

  // 3. Derived state: Paginated
  const paginatedPapers = useMemo(() => {
    const startIndex = (store.currentPage - 1) * ITEMS_PER_PAGE
    return sortedPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedPapers, store.currentPage])

  const totalPages = Math.ceil(sortedPapers.length / ITEMS_PER_PAGE)

  return {
    // Data
    papers: paginatedPapers,
    totalPapersCount: sortedPapers.length,
    isLoading: store.isLoading,
    error: store.error,
    
    // View state
    viewMode: store.viewMode,

    // Filters State
    searchQuery: store.searchQuery,
    statusFilter: store.statusFilter,
    isFavoriteFilter: store.isFavoriteFilter,
    tagFilter: store.tagFilter,
    sortBy: store.sortBy,
    
    // Pagination state
    currentPage: store.currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,

    // Actions
    setViewMode: store.setViewMode,
    setSearchQuery: store.setSearchQuery,
    setStatusFilter: store.setStatusFilter,
    setIsFavoriteFilter: store.setIsFavoriteFilter,
    setTagFilter: store.setTagFilter,
    setSortBy: store.setSortBy,
    setCurrentPage: store.setCurrentPage,
    refresh: fetchPapers,
  }
}
