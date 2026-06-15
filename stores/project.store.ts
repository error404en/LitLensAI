import { create } from "zustand"
import { Project, ProjectStatus } from "../lib/types"

interface ProjectState {
  projects: readonly Project[]
  selectedProjectId: string | null
  isLoading: boolean
  error: string | null

  // View Preferences
  viewMode: "grid" | "list"

  // Filters and Sorting
  searchQuery: string
  statusFilter: ProjectStatus | "all"
  isFavoriteFilter: boolean | "all"
  sortBy: "updated" | "created" | "alphabetical" | "paper_count" | "completion"

  // Actions
  setProjects: (projects: readonly Project[]) => void
  setSelectedProjectId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  setViewMode: (mode: "grid" | "list") => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: ProjectStatus | "all") => void
  setIsFavoriteFilter: (isFav: boolean | "all") => void
  setSortBy: (sort: "updated" | "created" | "alphabetical" | "paper_count" | "completion") => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: false,
  error: null,

  viewMode: "grid",
  searchQuery: "",
  statusFilter: "all",
  isFavoriteFilter: "all",
  sortBy: "updated",

  setProjects: (projects) => set({ projects }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setIsFavoriteFilter: (isFavoriteFilter) => set({ isFavoriteFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
}))
