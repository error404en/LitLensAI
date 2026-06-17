import { RetrieverRepository } from "../../repositories/retriever.repository";
import { AIProvider } from "../providers/ai-provider.interface";
import { Ranker, RankedChunk } from "../ranking/ranker";

export class SemanticRetriever {
  private repo = RetrieverRepository;
  private ranker = new Ranker();
  
  constructor(private provider: AIProvider) {}

  /**
   * Core retrieve function.
   */
  async retrieve(query: string, filter?: Record<string, unknown>, limit: number = 5): Promise<RankedChunk[]> {
    const vector = await this.provider.embed(query);
    const results = await this.repo.searchSimilarChunks(vector, filter, limit);
    return this.ranker.rank(results);
  }

  /**
   * Retrieve chunks restricted to a specific paper
   */
  async retrieveByPaper(query: string, paperId: string, limit: number = 5): Promise<RankedChunk[]> {
    const filter = {
      must: [
        {
          key: "paperId",
          match: { value: paperId }
        }
      ]
    };
    return this.retrieve(query, filter, limit);
  }

  /**
   * Retrieve chunks restricted to a specific project
   */
  async retrieveByProject(query: string, projectId: string, limit: number = 10): Promise<RankedChunk[]> {
    const paperIds = await this.repo.getPaperIdsForProject(projectId);
    
    if (paperIds.length === 0) return [];

    const filter = {
      must: [
        {
          key: "paperId",
          match: { any: paperIds }
        }
      ]
    };
    return this.retrieve(query, filter, limit);
  }

  /**
   * Top K generic retrieval
   */
  async retrieveTopK(query: string, k: number): Promise<RankedChunk[]> {
    return this.retrieve(query, undefined, k);
  }
}
