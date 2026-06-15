import { useState, useEffect, useCallback } from "react"
import { ProjectsService } from "../services/projects.service"
import { ProjectActivity } from "../lib/types"

export function useProjectActivity(projectId?: string) {
  const [activities, setActivities] = useState<ProjectActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true)
    setError(null)
    try {
      const data = await ProjectsService.getProjectActivity(projectId)
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activity")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  return {
    activities,
    isLoading,
    error,
    refresh: fetchActivity
  }
}
