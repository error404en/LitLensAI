export interface PDFExtractionResult {
  title: string;
  metadata: any;
  authors: string[];
  pages: number;
  fullText: string;
}

export class PDFParserService {
  /**
   * Extracts text and metadata from a PDF buffer
   */
  async extract(buffer: Buffer): Promise<PDFExtractionResult> {
    const pdfParseLib = await import("pdf-parse");
    const pdfParse = (pdfParseLib as unknown as { default?: Function }).default || pdfParseLib;
    const data = await (pdfParse as Function)(buffer);

    return {
      title: data.info?.Title || "Untitled Document",
      metadata: data.info,
      authors: data.info?.Author ? data.info.Author.split(",").map((a: string) => a.trim()) : [],
      pages: data.numpages,
      fullText: data.text,
    };
  }
}
