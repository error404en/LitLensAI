import { useQuery } from "@tanstack/react-query";
import { PapersRepository } from "../lib/repositories/papers.repository";

// Stub for now: in production this would call SemanticRetriever or similar 
// to find papers related to a specific context or the latest paper.
export const useRelatedPapers = (projectId: string, sourcePaperId?: string | null) => {
  return useQuery({
    queryKey: ["related-papers", projectId, sourcePaperId],
    queryFn: async () => {
      const papers = await PapersRepository.findByProjectId(projectId);
      const otherPapers = papers.filter(p => p.id !== sourcePaperId);
      
      if (!sourcePaperId) {
        // Return most recently updated papers if no source provided
        return otherPapers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
      }

      const sourcePaper = papers.find(p => p.id === sourcePaperId);
      if (!sourcePaper || !sourcePaper.tags || sourcePaper.tags.length === 0) {
        return otherPapers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
      }

      // Sort by number of shared tags
      return otherPapers.sort((a, b) => {
        const aShared = a.tags?.filter(t => sourcePaper.tags.includes(t)).length || 0;
        const bShared = b.tags?.filter(t => sourcePaper.tags.includes(t)).length || 0;
        return bShared - aShared;
      }).slice(0, 3);
    },
    enabled: !!projectId,
  });
};
