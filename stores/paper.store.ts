import { create } from "zustand"
import { Paper, PaperStatus } from "../lib/types"

interface PaperState {
  papers: readonly Paper[]
  selectedPaperId: string | null
  isLoading: boolean
  error: string | null
  
  // Filters and Sorting
  searchQuery: string
  statusFilter: PaperStatus | "all"
  tagFilter: string | null
  sortBy: "year" | "alphabetical" | "recent"

  // Actions
  setPapers: (papers: readonly Paper[]) => void
  setSelectedPaperId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: PaperStatus | "all") => void
  setTagFilter: (tag: string | null) => void
  setSortBy: (sort: "year" | "alphabetical" | "recent") => void
}

export const usePaperStore = create<PaperState>((set) => ({
  papers: [],
  selectedPaperId: null,
  isLoading: false,
  error: null,

  searchQuery: "",
  statusFilter: "all",
  tagFilter: null,
  sortBy: "recent",

  setPapers: (papers) => set({ papers }),
  setSelectedPaperId: (id) => set({ selectedPaperId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setTagFilter: (tagFilter) => set({ tagFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
}))
