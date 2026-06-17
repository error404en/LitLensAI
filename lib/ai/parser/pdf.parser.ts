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

type PdfParseFn = (dataBuffer: Buffer) => Promise<{
  numpages: number;
  numrender: number;
  info: PDFMetadata;
  metadata: unknown;
  text: string;
  version: string;
}>;

export class PDFParserService {
  /**
   * Extracts text and heuristic metadata from a PDF buffer
   */
  async extract(buffer: Buffer): Promise<PDFExtractionResult> {
    const pdfParseLib = await import("pdf-parse");
    const pdfParse = ((pdfParseLib as unknown as { default?: PdfParseFn }).default || pdfParseLib) as PdfParseFn;
    const data = await pdfParse(buffer);

    const fullText = data.text;
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

    return {
      title: data.info?.title || "Untitled Document",
      metadata: data.info || {},
      authors: data.info?.author ? data.info.author.split(",").map((a: string) => a.trim()) : [],
      pages: data.numpages,
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
