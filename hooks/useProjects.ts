import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useProjectStore } from "../stores/project.store"
import { ProjectsService } from "../services/projects.service"

export function useProjects() {
  const store = useProjectStore()
  const queryClient = useQueryClient()

  // 1. Fetch data with TanStack Query
  const { data: rawProjects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => ProjectsService.getProjects(),
  })

  // 2. Derived state: Filtered
  const filteredProjects = useMemo(() => {
    let result = [...rawProjects]

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
  }, [rawProjects, store.statusFilter, store.isFavoriteFilter, store.searchQuery])

  // 3. Derived state: Sorted
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

  const totalArchived = rawProjects.filter(p => p.status === "archived").length;
  const totalFavorites = rawProjects.filter(p => p.isFavorite).length;

  // 4. Mutations
  const createMutation = useMutation({
    mutationFn: ({ title, description, isFavorite }: { title: string, description?: string, isFavorite?: boolean }) => 
      ProjectsService.createProject(title, description, isFavorite),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectsService.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => ProjectsService.archiveProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  })

  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFav }: { id: string, isFav: boolean }) => ProjectsService.toggleFavorite(id, isFav),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
  })

  return {
    // Data
    projects: sortedProjects,
    totalCount: rawProjects.length,
    activeCount: rawProjects.length - totalArchived,
    archivedCount: totalArchived,
    favoritesCount: totalFavorites,
    isLoading,
    error: error instanceof Error ? error.message : error ? "An error occurred" : null,
    
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
    refresh: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),

    // Mutations (Optimistic UI ready)
    createProject: async (title: string, description?: string, isFavorite?: boolean) => {
      return createMutation.mutateAsync({ title, description, isFavorite })
    },
    deleteProject: async (id: string) => {
      return deleteMutation.mutateAsync(id)
    },
    archiveProject: async (id: string) => {
      return archiveMutation.mutateAsync(id)
    },
    toggleFavorite: async (id: string, isFav: boolean) => {
      return favoriteMutation.mutateAsync({ id, isFav })
    }
  }
}
