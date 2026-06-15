import {
  PDFOutlineItem,
  PDFBookmark,
  PDFHighlight,
  PDFAnnotation,
  PDFDocumentMeta,
  PDFSearchResult,
} from "../types/pdf";

// In-memory storage
let bookmarksData: PDFBookmark[] = [];
let highlightsData: PDFHighlight[] = [];
let annotationsData: PDFAnnotation[] = [];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mock outline for any paper
function generateMockOutline(paperId: string): PDFOutlineItem[] {
  return [
    { id: `${paperId}_o1`, title: "Abstract", page: 1, level: 0 },
    { id: `${paperId}_o2`, title: "1. Introduction", page: 2, level: 0 },
    { id: `${paperId}_o3`, title: "1.1 Background", page: 2, level: 1 },
    { id: `${paperId}_o4`, title: "1.2 Motivation", page: 3, level: 1 },
    { id: `${paperId}_o5`, title: "2. Related Work", page: 4, level: 0 },
    { id: `${paperId}_o6`, title: "3. Methodology", page: 6, level: 0 },
    { id: `${paperId}_o7`, title: "3.1 Architecture", page: 6, level: 1 },
    { id: `${paperId}_o8`, title: "3.2 Training", page: 7, level: 1 },
    { id: `${paperId}_o9`, title: "4. Experiments", page: 9, level: 0 },
    { id: `${paperId}_o10`, title: "4.1 Datasets", page: 9, level: 1 },
    { id: `${paperId}_o11`, title: "4.2 Results", page: 10, level: 1 },
    { id: `${paperId}_o12`, title: "5. Discussion", page: 12, level: 0 },
    { id: `${paperId}_o13`, title: "6. Conclusion", page: 14, level: 0 },
    { id: `${paperId}_o14`, title: "References", page: 15, level: 0 },
  ];
}

function generateMockSearchResults(query: string): PDFSearchResult[] {
  if (!query.trim()) return [];
  const results: PDFSearchResult[] = [];
  const pages = [1, 3, 5, 7, 9, 11, 14];
  pages.forEach((page, i) => {
    results.push({
      page,
      text: `...${query} appears in the context of neural network architectures and attention mechanisms...`,
      index: i,
    });
  });
  return results;
}

export const PDFRepository = {
  async load(paperId: string): Promise<{ meta: PDFDocumentMeta; outline: PDFOutlineItem[] }> {
    await delay(400);
    return {
      meta: { totalPages: 16, title: "Research Paper", wordCount: 12450 },
      outline: generateMockOutline(paperId),
    };
  },

  // Bookmarks
  async getBookmarks(paperId: string): Promise<PDFBookmark[]> {
    await delay(100);
    return bookmarksData.filter((b) => b.paperId === paperId);
  },

  async addBookmark(bookmark: Omit<PDFBookmark, "id" | "createdAt">): Promise<PDFBookmark> {
    await delay(100);
    const newBookmark: PDFBookmark = {
      ...bookmark,
      id: `bm_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    bookmarksData.push(newBookmark);
    return newBookmark;
  },

  async removeBookmark(id: string): Promise<void> {
    await delay(50);
    bookmarksData = bookmarksData.filter((b) => b.id !== id);
  },

  // Highlights
  async getHighlights(paperId: string): Promise<PDFHighlight[]> {
    await delay(100);
    return highlightsData.filter((h) => h.paperId === paperId);
  },

  async addHighlight(highlight: Omit<PDFHighlight, "id" | "createdAt">): Promise<PDFHighlight> {
    await delay(100);
    const newHighlight: PDFHighlight = {
      ...highlight,
      id: `hl_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    highlightsData.push(newHighlight);
    return newHighlight;
  },

  async removeHighlight(id: string): Promise<void> {
    await delay(50);
    highlightsData = highlightsData.filter((h) => h.id !== id);
    // Also remove linked annotations
    annotationsData = annotationsData.filter((a) => a.highlightId !== id);
  },

  // Annotations
  async getAnnotations(paperId: string): Promise<PDFAnnotation[]> {
    await delay(100);
    return annotationsData.filter((a) => a.paperId === paperId);
  },

  async addAnnotation(annotation: Omit<PDFAnnotation, "id" | "createdAt" | "updatedAt">): Promise<PDFAnnotation> {
    await delay(100);
    const newAnnotation: PDFAnnotation = {
      ...annotation,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    annotationsData.push(newAnnotation);
    return newAnnotation;
  },

  async updateAnnotation(id: string, content: string): Promise<PDFAnnotation> {
    await delay(100);
    const index = annotationsData.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Annotation not found");
    annotationsData[index] = { ...annotationsData[index], content, updatedAt: new Date().toISOString() };
    return annotationsData[index];
  },

  async deleteAnnotation(id: string): Promise<void> {
    await delay(50);
    annotationsData = annotationsData.filter((a) => a.id !== id);
  },

  // Search
  async search(paperId: string, query: string): Promise<PDFSearchResult[]> {
    await delay(300);
    return generateMockSearchResults(query);
  },
};
