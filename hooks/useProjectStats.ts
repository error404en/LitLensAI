import { useState, useEffect, useCallback } from "react"
import { ProjectsService } from "../services/projects.service"
import { ProjectStats } from "../lib/types"

export function useProjectStats(projectId?: string) {
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true)
    setError(null)
    try {
      const data = await ProjectsService.getProjectStats(projectId)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  return {
    stats,
    isLoading,
    error,
    refresh: fetchStats
  }
}
