import { useEffect, useCallback } from "react"
import { useProjectStore } from "../stores/project.store"
import { getProjectById } from "../lib/api"

export function useProject(projectId: string | null) {
  const store = useProjectStore()
  
  const cachedProject = store.projects.find(p => p.id === projectId)

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await getProjectById(projectId)
      if (data) {
        store.setSelectedProjectId(data.id)
      } else {
        store.setError("Project not found")
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to fetch project")
    } finally {
      store.setLoading(false)
    }
  }, [projectId, store])

  useEffect(() => {
    if (projectId && !cachedProject) {
      fetchProject()
    } else if (projectId) {
      store.setSelectedProjectId(projectId)
    } else {
      store.setSelectedProjectId(null)
    }
  }, [projectId, cachedProject, fetchProject, store])

  return {
    project: cachedProject || store.projects.find(p => p.id === store.selectedProjectId),
    isLoading: store.isLoading,
    error: store.error,
    refresh: fetchProject,
  }
}
