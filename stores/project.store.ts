import { create } from "zustand"
import { Project } from "../lib/types"

interface ProjectState {
  projects: readonly Project[]
  selectedProjectId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setProjects: (projects: readonly Project[]) => void
  setSelectedProjectId: (id: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
