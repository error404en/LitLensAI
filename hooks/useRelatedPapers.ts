import { useQuery } from "@tanstack/react-query";
import { PapersRepository } from "../lib/repositories/papers.repository";

// Stub for now: in production this would call SemanticRetriever or similar 
// to find papers related to a specific context or the latest paper.
export const useRelatedPapers = (projectId: string, sourcePaperId?: string | null) => {
  return useQuery({
    queryKey: ["related-papers", projectId, sourcePaperId],
    queryFn: async () => {
      const papers = await PapersRepository.findByProjectId(projectId);
      // Mock: return random 3 papers
      return papers.filter(p => p.id !== sourcePaperId).slice(0, 3);
    },
    enabled: !!projectId,
  });
};
