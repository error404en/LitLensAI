import { RankedChunk } from "./ranker";
import { RankingStrategy } from "./strategy";

export class HybridRanker implements RankingStrategy {
  /**
   * Applies post-retrieval reranking based on vector score + heuristics.
   */
  rank(chunks: RankedChunk[], query: string): RankedChunk[] {
    return chunks.map(chunk => {
      let finalScore = chunk.score;

      // Recency Boost (simulated: assuming chunk metadata contains year)
      // if (chunk.year && chunk.year > 2023) finalScore += 0.05;

      // Page Boost (give slight preference to earlier pages like abstract/intro)
      if (chunk.pageNumber && chunk.pageNumber <= 2) {
        finalScore += 0.02;
      }

      // Keyword match boost (if the chunk directly contains the query exact match)
      if (chunk.content.toLowerCase().includes(query.toLowerCase())) {
        finalScore += 0.1;
      }

      return {
        ...chunk,
        score: Math.min(finalScore, 1.0) // cap at 1.0
      };
    }).sort((a, b) => b.score - a.score);
  }
}
