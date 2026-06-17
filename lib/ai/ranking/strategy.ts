import { RankedChunk } from "./ranker";

export interface RankingStrategy {
  rank(chunks: RankedChunk[], query: string): RankedChunk[];
}
