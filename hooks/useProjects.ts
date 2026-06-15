import { useEffect, useMemo, useCallback } from "react"
import { useProjectStore } from "../stores/project.store"
import { ProjectsService } from "../services/projects.service"

export function useProjects() {
  const store = useProjectStore()

  const fetchProjects = useCallback(async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await ProjectsService.getProjects()
      store.setProjects(data)
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to fetch projects")
    } finally {
      store.setLoading(false)
    }
  }, [store])

  // Initial fetch
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // 1. Derived state: Filtered
  const filteredProjects = useMemo(() => {
    let result = [...store.projects]

    // Status Filter
    if (store.statusFilter !== "all") {
      result = result.filter((p) => p.status === store.statusFilter)
    }

    // Favorite Filter
    if (store.isFavoriteFilter !== "all") {
      result = result.filter((p) => p.isFavorite === store.isFavoriteFilter)
    }

    // Search Query (Multi-keyword)
    if (store.searchQuery.trim()) {
      const keywords = store.searchQuery.toLowerCase().trim().split(/\s+/)
      
      result = result.filter((p) => {
        const searchableText = [
          p.title,
          p.description || "",
        ].join(" ").toLowerCase()
        
        return keywords.every(kw => searchableText.includes(kw))
      })
    }

    return result
  }, [store.projects, store.statusFilter, store.isFavoriteFilter, store.searchQuery])

  // 2. Derived state: Sorted
  const sortedProjects = useMemo(() => {
    const result = [...filteredProjects]
    
    result.sort((a, b) => {
      switch (store.sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "paper_count":
          return (b.stats?.paperCount || 0) - (a.stats?.paperCount || 0)
        case "completion":
          return (b.stats?.completionPercentage || 0) - (a.stats?.completionPercentage || 0)
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return result
  }, [filteredProjects, store.sortBy])

  const totalArchived = store.projects.filter(p => p.status === "archived").length;
  const totalFavorites = store.projects.filter(p => p.isFavorite).length;

  return {
    // Data
    projects: sortedProjects,
    totalCount: store.projects.length,
    activeCount: store.projects.length - totalArchived,
    archivedCount: totalArchived,
    favoritesCount: totalFavorites,
    isLoading: store.isLoading,
    error: store.error,
    
    // View state
    viewMode: store.viewMode,

    // Filters State
    searchQuery: store.searchQuery,
    statusFilter: store.statusFilter,
    isFavoriteFilter: store.isFavoriteFilter,
    sortBy: store.sortBy,
    
    // Actions
    setViewMode: store.setViewMode,
    setSearchQuery: store.setSearchQuery,
    setStatusFilter: store.setStatusFilter,
    setIsFavoriteFilter: store.setIsFavoriteFilter,
    setSortBy: store.setSortBy,
    refresh: fetchProjects,

    // Mutations (Optimistic UI ready)
    createProject: async (title: string, description?: string, isFavorite?: boolean) => {
      const proj = await ProjectsService.createProject(title, description, isFavorite)
      await fetchProjects()
      return proj
    },
    deleteProject: async (id: string) => {
      await ProjectsService.deleteProject(id)
      await fetchProjects()
    },
    archiveProject: async (id: string) => {
      await ProjectsService.archiveProject(id)
      await fetchProjects()
    },
    toggleFavorite: async (id: string, isFav: boolean) => {
      await ProjectsService.toggleFavorite(id, isFav)
      await fetchProjects()
    }
  }
}
