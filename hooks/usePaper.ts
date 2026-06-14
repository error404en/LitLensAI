import { useEffect, useCallback } from "react"
import { usePaperStore } from "../stores/paper.store"
import { getPaperById } from "../lib/api"

export function usePaper(paperId: string | null) {
  const store = usePaperStore()
  
  // Try to find it in the store first
  const cachedPaper = store.papers.find(p => p.id === paperId)

  const fetchPaper = useCallback(async () => {
    if (!paperId) return
    
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await getPaperById(paperId)
      if (data) {
        // Update the specific paper in the store if we have it, else we might just want to store it as selected
        store.setSelectedPaperId(data.id)
      } else {
        store.setError("Paper not found")
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to fetch paper")
    } finally {
      store.setLoading(false)
    }
  }, [paperId, store])

  useEffect(() => {
    if (paperId && !cachedPaper) {
      fetchPaper()
    } else if (paperId) {
      store.setSelectedPaperId(paperId)
    } else {
      store.setSelectedPaperId(null)
    }
  }, [paperId, cachedPaper, fetchPaper, store])

  return {
    paper: cachedPaper || store.papers.find(p => p.id === store.selectedPaperId),
    isLoading: store.isLoading,
    error: store.error,
    refresh: fetchPaper,
  }
}
