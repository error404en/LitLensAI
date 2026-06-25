import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useProjectStore } from "../stores/project.store"
import { ProjectsService } from "../services/projects.service"
import { Project } from "../lib/types"
import { useEffect } from "react"

export function useProject(id?: string) {
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId)
  const queryClient = useQueryClient()

  const { data: project = null, isLoading, error, refetch } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await ProjectsService.getProject(id);
      if (!data) return null;
      const stats = await ProjectsService.getProjectStats(id);
      return { ...data, stats };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  useEffect(() => {
    if (id) setSelectedProjectId(id)
    return () => setSelectedProjectId(null)
  }, [id, setSelectedProjectId])

  const { mutateAsync: updateProject } = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      if (!id) return;
      return ProjectsService.updateProject(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  })

  return {
    project,
    isLoading,
    error: error instanceof Error ? error.message : error ? "Failed to fetch project" : null,
    refresh: refetch,
    updateProject
  }
}
