import { useState, useEffect, useCallback } from "react"
import { useProjectStore } from "../stores/project.store"
import { ProjectsService } from "../services/projects.service"
import { Project } from "../lib/types"

export function useProject(id?: string) {
  const store = useProjectStore()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setIsLoading(true)
    setError(null)
    try {
      const data = await ProjectsService.getProject(id)
      // Hydrate stats
      const stats = await ProjectsService.getProjectStats(id)
      setProject({ ...data, stats })
      store.setSelectedProjectId(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project")
    } finally {
      setIsLoading(false)
    }
  }, [id, store])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject()
    return () => store.setSelectedProjectId(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return {
    project,
    isLoading,
    error,
    refresh: fetchProject,
    updateProject: async (updates: Partial<Project>) => {
      if (!id) return;
      await ProjectsService.updateProject(id, updates);
      await fetchProject();
    }
  }
}
