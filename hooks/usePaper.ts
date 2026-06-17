import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PapersService } from "../services/papers.service"
import { usePaperStore } from "../stores/paper.store"
import { useEffect } from "react"

export function usePaper(paperId: string | null) {
  const store = usePaperStore()
  const queryClient = useQueryClient()

  const { data: paper, isLoading, error } = useQuery({
    queryKey: ["paper", paperId],
    queryFn: async () => {
      if (!paperId) return null
      const data = await PapersService.getPaper(paperId)
      if (!data) throw new Error("Paper not found")
      return data
    },
    enabled: !!paperId,
  })

  useEffect(() => {
    if (paperId) {
      store.setSelectedPaperId(paperId)
    } else {
      store.setSelectedPaperId(null)
    }
  }, [paperId, store])

  return {
    paper: paper || undefined,
    isLoading,
    error: error instanceof Error ? error.message : error ? "Failed to fetch paper" : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["paper", paperId] }),
  }
}
