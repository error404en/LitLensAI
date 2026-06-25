import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usePaperStore } from "../stores/paper.store"
import { PapersService } from "../services/papers.service"
import { Paper } from "../lib/types"

const ITEMS_PER_PAGE = 12

export function usePapers(projectId?: string) {
  const store = usePaperStore()
  const queryClient = useQueryClient()

  const { data: rawPapers = [], isLoading, error } = useQuery({
    queryKey: ["papers", projectId],
    queryFn: () => PapersService.getPapers(projectId),
  })

  // 1. Derived state: Filtered
  const filteredPapers = useMemo(() => {
    let result = [...rawPapers]

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
  }, [rawPapers, store.statusFilter, store.isFavoriteFilter, store.tagFilter, store.searchQuery])

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
    allPapers: sortedPapers,
    totalPapersCount: sortedPapers.length,
    isLoading,
    error: error instanceof Error ? error.message : error ? "Failed to fetch papers" : null,
    
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
    refresh: () => queryClient.invalidateQueries({ queryKey: ["papers"] }),

    // Mutations
    deletePaper: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["papers"] });
      const previousPapers = queryClient.getQueryData<Paper[]>(["papers", projectId]);
      if (previousPapers) {
        queryClient.setQueryData<Paper[]>(["papers", projectId], old => old ? old.filter(p => p.id !== id) : []);
      }
      try {
        await PapersService.deletePaper(id);
      } catch (err) {
        if (previousPapers) queryClient.setQueryData(["papers", projectId], previousPapers);
        throw err;
      } finally {
        queryClient.invalidateQueries({ queryKey: ["papers"] });
      }
    },
    toggleFavorite: async (id: string, isFavorite: boolean) => {
      await PapersService.updatePaper(id, { isFavorite })
      queryClient.invalidateQueries({ queryKey: ["papers"] })
    },
    renamePaper: async (id: string, title: string) => {
      await PapersService.updatePaper(id, { title })
      queryClient.invalidateQueries({ queryKey: ["papers"] })
    }
  }
}
