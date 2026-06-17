export interface RankedChunk {
  score: number;
  chunkId: string;
  paperId: string;
  pageNumber: number;
  content: string;
}

export interface RankOptions {
  boostRecency?: boolean; // placeholder for date metadata boosting
  boostProject?: boolean;
}

export class Ranker {
  /**
   * Post-retrieval ranking.
   * Qdrant already gives us semantic similarity score.
   * This module allows us to re-weight based on metadata (e.g. proximity, citation graph, recency).
   */
  rank(chunks: RankedChunk[], options?: RankOptions): RankedChunk[] {
    // Basic implementation: just return sorted by score descending
    // In the future, we could apply cross-encoder reranking here
    return chunks.sort((a, b) => b.score - a.score);
  }
}
