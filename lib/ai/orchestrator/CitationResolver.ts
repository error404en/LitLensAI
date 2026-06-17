import { RankedChunk } from "../ranking/ranker";

export interface Citation {
  paperId: string;
  chunkId: string;
  pageNumber: number;
  snippet: string;
  confidence: number;
}

export class CitationResolver {
  /**
   * Identifies which chunks were actually used to generate the response.
   * This is a simplified version; advanced implementations would parse the LLM's [Source X] tokens.
   */
  static resolve(responseContent: string, retrievedChunks?: RankedChunk[]): Citation[] {
    if (!retrievedChunks || retrievedChunks.length === 0) return [];
    
    const citations: Citation[] = [];
    
    // Naive resolution: if the response mentions "Source X", we link it to the chunk.
    retrievedChunks.forEach((chunk, index) => {
      const sourceTag = `[Source ${index + 1}]`;
      if (responseContent.includes(sourceTag)) {
        citations.push({
          paperId: chunk.paperId,
          chunkId: chunk.chunkId,
          pageNumber: chunk.pageNumber,
          snippet: chunk.content.substring(0, 100) + "...",
          confidence: chunk.score,
        });
      }
    });

    return citations;
  }
}
