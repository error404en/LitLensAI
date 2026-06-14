import { create } from "zustand"
import { Paper, PaperStatus } from "../lib/types"

interface PaperState {
  papers: readonly Paper[]
  selectedPaperId: string | null
  isLoading: boolean
  error: string | null
  
  // View Preferences
  viewMode: "grid" | "list"

  // Filters and Sorting
  searchQuery: string
  statusFilter: PaperStatus | "all"
  isFavoriteFilter: boolean | "all"
  tagFilter: string | null
  sortBy: "newest" | "oldest" | "title-a-z" | "title-z-a" | "year" | "recent"
  currentPage: number

  // Actions
  setPapers: (papers: readonly Paper[]) => void
  setSelectedPaperId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  setViewMode: (mode: "grid" | "list") => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: PaperStatus | "all") => void
  setIsFavoriteFilter: (isFav: boolean | "all") => void
  setTagFilter: (tag: string | null) => void
  setSortBy: (sort: "newest" | "oldest" | "title-a-z" | "title-z-a" | "year" | "recent") => void
  setCurrentPage: (page: number) => void
}

export const usePaperStore = create<PaperState>((set) => ({
  papers: [],
  selectedPaperId: null,
  isLoading: false,
  error: null,

  viewMode: "grid",

  searchQuery: "",
  statusFilter: "all",
  isFavoriteFilter: "all",
  tagFilter: null,
  sortBy: "newest",
  currentPage: 1,

  setPapers: (papers) => set({ papers }),
  setSelectedPaperId: (id) => set({ selectedPaperId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setIsFavoriteFilter: (isFavoriteFilter) => set({ isFavoriteFilter, currentPage: 1 }),
  setTagFilter: (tagFilter) => set({ tagFilter, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}))
