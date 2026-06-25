import { RetrieverRepository } from "../../repositories/retriever.repository";
import { AIProvider } from "../providers/ai-provider.interface";
import { Ranker, RankedChunk } from "../ranking/ranker";
import { RetrievalCache } from "../cache/retrieval-cache";
import { StructuredLogger } from "../orchestrator/StructuredLogger";

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
  async retrieveByPaper(query: string, paperId: string, orgId?: string, limit: number = 5): Promise<RankedChunk[]> {
    const cacheKey = orgId ? `${orgId}_${paperId}` : paperId;
    const cached = await RetrievalCache.get(query, cacheKey);
    if (cached) {
      StructuredLogger.info("RETRIEVAL_CACHE_HIT", { query, scope: cacheKey });
      return cached;
    }

    const mustConds: Record<string, unknown>[] = [{ key: "paperId", match: { value: paperId } }];
    if (orgId) {
      mustConds.push({ key: "orgId", match: { value: orgId } });
    }

    const filter = { must: mustConds };
    const results = await this.retrieve(query, filter, limit);
    await RetrievalCache.set(query, results, cacheKey);
    return results;
  }

  /**
   * Retrieve chunks restricted to a specific project
   */
  async retrieveByProject(query: string, projectId: string, orgId?: string, limit: number = 10): Promise<RankedChunk[]> {
    const cacheKey = orgId ? `${orgId}_${projectId}` : projectId;
    const cached = await RetrievalCache.get(query, cacheKey);
    if (cached) {
      StructuredLogger.info("RETRIEVAL_CACHE_HIT", { query, scope: cacheKey });
      return cached;
    }

    const paperIds = await this.repo.getPaperIdsForProject(projectId);
    
    if (paperIds.length === 0) return [];

    const mustConds: Record<string, unknown>[] = [{ key: "paperId", match: { any: paperIds } }];
    if (orgId) {
      mustConds.push({ key: "orgId", match: { value: orgId } });
    }

    const filter = { must: mustConds };
    const results = await this.retrieve(query, filter, limit);
    await RetrievalCache.set(query, results, cacheKey);
    return results;
  }

  /**
   * Top K generic retrieval
   */
  async retrieveTopK(query: string, k: number, orgId?: string): Promise<RankedChunk[]> {
    const cacheKey = orgId ? `global_${orgId}` : "global";
    const cached = await RetrievalCache.get(query, cacheKey);
    if (cached) {
      StructuredLogger.info("RETRIEVAL_CACHE_HIT", { query, scope: cacheKey });
      return cached;
    }

    const filter = orgId ? { must: [{ key: "orgId", match: { value: orgId } }] } : undefined;
    const results = await this.retrieve(query, filter, k);
    await RetrievalCache.set(query, results, cacheKey);
    return results;
  }
}
