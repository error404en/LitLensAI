import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface ChunkResult {
  content: string;
  pageNumber: number;
  chunkIndex: number;
  tokenCount: number;
}

export class DocumentChunker {
  private splitter: RecursiveCharacterTextSplitter;

  constructor(chunkSize: number = 1000, chunkOverlap: number = 200) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
  }

  /**
   * Splits text into overlapping chunks
   */
  async chunk(text: string): Promise<ChunkResult[]> {
    const docs = await this.splitter.createDocuments([text]);
    
    // Simplistic page mapping for now (real implementation would parse PDF page by page)
    return docs.map((doc, index) => ({
      content: doc.pageContent,
      pageNumber: 1, // Placeholder until PDF parser returns page-level text
      chunkIndex: index,
      tokenCount: Math.ceil(doc.pageContent.length / 4), // Rough estimate
    }));
  }
}
