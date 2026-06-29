export interface PDFMetadata {
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
  [key: string]: string | undefined;
}

export interface PDFExtractionResult {
  title: string;
  metadata: PDFMetadata;
  authors: string[];
  pages: number;
  fullText: string;
  enriched: {
    readingTimeMinutes: number;
    wordCount: number;
    keywords: string[];
    language: string;
    topics: string[];
    summary: string;
    citationCount: number;
  };
}

export class PDFParserService {
  /**
   * Extracts text and heuristic metadata from a PDF buffer
   */
  async extract(buffer: Buffer): Promise<PDFExtractionResult> {
    const { createRequire } = await import("module");
    const requireFn = createRequire(import.meta.url);
    const pdfParseLib = requireFn("pdf-parse");
    const parser = new pdfParseLib.PDFParse({ data: buffer });
    
    const textResult = await parser.getText();
    const infoResult = await parser.getInfo();

    const fullText: string = textResult.text || "";
    const words = fullText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // Average 200 WPM

    // Very basic heuristic keyword extraction
    const commonWords = new Set(["the", "and", "of", "to", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are"]);
    const wordFreq: Record<string, number> = {};
    for (const w of words) {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.length > 4 && !commonWords.has(lower)) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    }
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);

    const metadataInfo = (infoResult.info || {}) as PDFMetadata;

    return {
      title: metadataInfo.Title || metadataInfo.title || "Untitled Document",
      metadata: metadataInfo,
      authors: metadataInfo.Author ? metadataInfo.Author.split(",").map((a: string) => a.trim()) : (metadataInfo.author ? metadataInfo.author.split(",").map((a: string) => a.trim()) : []),
      pages: infoResult.total,
      fullText,
      enriched: {
        readingTimeMinutes,
        wordCount,
        keywords,
        language: "en", // Default placeholder
        topics: keywords.slice(0, 3), // Topics placeholder
        summary: "Pending AI Summarization", // Placeholder
        citationCount: 0 // Placeholder
      }
    };
  }
}
