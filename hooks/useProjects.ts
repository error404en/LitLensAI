import { useEffect, useCallback } from "react"
import { useProjectStore } from "../stores/project.store"
import { getProjects } from "../lib/api"

export function useProjects() {
  const store = useProjectStore()

  const fetchProjects = useCallback(async () => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await getProjects()
      store.setProjects(data)
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to fetch projects")
    } finally {
      store.setLoading(false)
    }
  }, [store])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects: store.projects,
    isLoading: store.isLoading,
    error: store.error,
    refresh: fetchProjects,
  }
}
