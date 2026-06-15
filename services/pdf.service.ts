import { PDFRepository } from "../lib/repositories/pdf.repository";
import {
  PDFOutlineItem,
  PDFBookmark,
  PDFHighlight,
  PDFAnnotation,
  PDFDocumentMeta,
  PDFSearchResult,
  PDFCitation,
  CitationFormat,
  HighlightColor,
} from "../lib/types/pdf";
import { Paper } from "../lib/types";
import { CreateHighlightSchema, CreateAnnotationSchema, UpdateAnnotationSchema, CreateBookmarkSchema } from "../lib/validations/pdf";
import { formatAuthors } from "../lib/utils";

function generateCitationText(paper: Paper, format: CitationFormat): string {
  const authors = formatAuthors(paper.authors);
  const year = paper.year;
  const title = paper.title;
  const journal = paper.journal || "Unknown Journal";

  switch (format) {
    case "apa":
      return `${authors} (${year}). ${title}. *${journal}*.`;
    case "ieee":
      return `${authors}, "${title}," *${journal}*, ${year}.`;
    case "mla":
      return `${authors}. "${title}." *${journal}*, ${year}.`;
    case "chicago":
      return `${authors}. "${title}." *${journal}* (${year}).`;
    case "bibtex":
      return `@article{${paper.id},\n  author = {${paper.authors.map((a) => a.name).join(" and ")}},\n  title = {${title}},\n  journal = {${journal}},\n  year = {${year}}\n}`;
    default:
      return `${authors} (${year}). ${title}.`;
  }
}

export const PDFService = {
  async loadPDF(paperId: string): Promise<{ meta: PDFDocumentMeta; outline: PDFOutlineItem[] }> {
    try {
      return await PDFRepository.load(paperId);
    } catch (error) {
      console.error("PDFService.loadPDF:", error);
      throw new Error("Failed to load PDF document");
    }
  },

  async search(paperId: string, query: string): Promise<PDFSearchResult[]> {
    try {
      if (!query.trim()) return [];
      return await PDFRepository.search(paperId, query);
    } catch (error) {
      console.error("PDFService.search:", error);
      throw new Error("Search failed");
    }
  },

  // Highlights
  async addHighlight(paperId: string, page: number, text: string, color: HighlightColor, startOffset: number, endOffset: number): Promise<PDFHighlight> {
    const validated = CreateHighlightSchema.parse({ paperId, page, text, color, position: { startOffset, endOffset } });
    return PDFRepository.addHighlight(validated);
  },

  async removeHighlight(id: string): Promise<void> {
    await PDFRepository.removeHighlight(id);
  },

  async getHighlights(paperId: string): Promise<PDFHighlight[]> {
    return PDFRepository.getHighlights(paperId);
  },

  // Annotations
  async addAnnotation(paperId: string, page: number, content: string, highlightId?: string): Promise<PDFAnnotation> {
    const validated = CreateAnnotationSchema.parse({ paperId, page, content, highlightId });
    return PDFRepository.addAnnotation(validated);
  },

  async editAnnotation(id: string, content: string): Promise<PDFAnnotation> {
    UpdateAnnotationSchema.parse({ content });
    return PDFRepository.updateAnnotation(id, content);
  },

  async deleteAnnotation(id: string): Promise<void> {
    await PDFRepository.deleteAnnotation(id);
  },

  async getAnnotations(paperId: string): Promise<PDFAnnotation[]> {
    return PDFRepository.getAnnotations(paperId);
  },

  // Bookmarks
  async bookmarkPage(paperId: string, page: number, label?: string): Promise<PDFBookmark> {
    const validated = CreateBookmarkSchema.parse({ paperId, page, label });
    return PDFRepository.addBookmark(validated);
  },

  async removeBookmark(id: string): Promise<void> {
    await PDFRepository.removeBookmark(id);
  },

  async getBookmarks(paperId: string): Promise<PDFBookmark[]> {
    return PDFRepository.getBookmarks(paperId);
  },

  // Citations
  generateCitation(paper: Paper, format: CitationFormat): PDFCitation {
    return {
      format,
      text: generateCitationText(paper, format),
    };
  },
};
