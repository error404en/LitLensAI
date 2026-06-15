// ============================================================
// PDF Reader & Annotation Domain Types
// ============================================================

export type HighlightColor = "yellow" | "green" | "blue" | "pink";

export type CitationFormat = "apa" | "ieee" | "mla" | "chicago" | "bibtex";

export type PDFSidebarTab = "outline" | "bookmarks" | "notes" | "search";

export type RightSidebarTab = "highlights" | "annotations" | "citation" | "ai";

export interface PDFOutlineItem {
  readonly id: string;
  readonly title: string;
  readonly page: number;
  readonly level: number;
  readonly children?: readonly PDFOutlineItem[];
}

export interface PDFBookmark {
  readonly id: string;
  readonly paperId: string;
  readonly page: number;
  readonly label?: string;
  readonly createdAt: string;
}

export interface PDFHighlight {
  readonly id: string;
  readonly paperId: string;
  readonly page: number;
  readonly text: string;
  readonly color: HighlightColor;
  readonly position: {
    readonly startOffset: number;
    readonly endOffset: number;
  };
  readonly annotationId?: string;
  readonly createdAt: string;
}

export interface PDFAnnotation {
  readonly id: string;
  readonly paperId: string;
  readonly page: number;
  readonly content: string;
  readonly highlightId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PDFSearchResult {
  readonly page: number;
  readonly text: string;
  readonly index: number;
}

export interface PDFSearchState {
  readonly query: string;
  readonly results: readonly PDFSearchResult[];
  readonly currentIndex: number;
  readonly isSearching: boolean;
}

export interface PDFDocumentMeta {
  readonly totalPages: number;
  readonly title: string;
  readonly wordCount: number;
}

export interface PDFSelectionContext {
  readonly text: string;
  readonly page: number;
  readonly position: { x: number; y: number };
}

export interface PDFCitation {
  readonly format: CitationFormat;
  readonly text: string;
}
