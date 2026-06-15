import { create } from "zustand";
import {
  PDFOutlineItem,
  PDFBookmark,
  PDFHighlight,
  PDFAnnotation,
  PDFSearchState,
  PDFDocumentMeta,
  PDFSelectionContext,
  PDFSidebarTab,
  RightSidebarTab,
} from "../lib/types/pdf";

interface PDFState {
  // Document
  paperId: string | null;
  meta: PDFDocumentMeta | null;
  outline: readonly PDFOutlineItem[];
  isLoading: boolean;
  error: string | null;

  // Navigation
  currentPage: number;
  zoom: number;

  // Sidebars
  leftSidebarTab: PDFSidebarTab;
  rightSidebarTab: RightSidebarTab;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;

  // Data
  bookmarks: PDFBookmark[];
  highlights: PDFHighlight[];
  annotations: PDFAnnotation[];

  // Search
  search: PDFSearchState;

  // Selection
  selectedText: PDFSelectionContext | null;

  // Actions: Document
  setPaperId: (id: string | null) => void;
  setMeta: (meta: PDFDocumentMeta | null) => void;
  setOutline: (outline: readonly PDFOutlineItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Actions: Navigation
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;

  // Actions: Sidebars
  setLeftSidebarTab: (tab: PDFSidebarTab) => void;
  setRightSidebarTab: (tab: RightSidebarTab) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;

  // Actions: Bookmarks
  setBookmarks: (bookmarks: PDFBookmark[]) => void;
  addBookmark: (bookmark: PDFBookmark) => void;
  removeBookmark: (id: string) => void;

  // Actions: Highlights
  setHighlights: (highlights: PDFHighlight[]) => void;
  addHighlight: (highlight: PDFHighlight) => void;
  removeHighlight: (id: string) => void;

  // Actions: Annotations
  setAnnotations: (annotations: PDFAnnotation[]) => void;
  addAnnotation: (annotation: PDFAnnotation) => void;
  updateAnnotation: (id: string, content: string) => void;
  removeAnnotation: (id: string) => void;

  // Actions: Search
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: PDFSearchState) => void;
  clearSearch: () => void;

  // Actions: Selection
  setSelectedText: (selection: PDFSelectionContext | null) => void;

  // Actions: Reset
  reset: () => void;
}

const initialSearchState: PDFSearchState = {
  query: "",
  results: [],
  currentIndex: -1,
  isSearching: false,
};

export const usePDFStore = create<PDFState>((set) => ({
  paperId: null,
  meta: null,
  outline: [],
  isLoading: false,
  error: null,

  currentPage: 1,
  zoom: 100,

  leftSidebarTab: "outline",
  rightSidebarTab: "highlights",
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,

  bookmarks: [],
  highlights: [],
  annotations: [],

  search: initialSearchState,
  selectedText: null,

  setPaperId: (paperId) => set({ paperId }),
  setMeta: (meta) => set({ meta }),
  setOutline: (outline) => set({ outline }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  setCurrentPage: (currentPage) => set({ currentPage }),
  setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(400, zoom)) }),

  setLeftSidebarTab: (leftSidebarTab) => set({ leftSidebarTab }),
  setRightSidebarTab: (rightSidebarTab) => set({ rightSidebarTab }),
  toggleLeftSidebar: () => set((s) => ({ isLeftSidebarOpen: !s.isLeftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ isRightSidebarOpen: !s.isRightSidebarOpen })),

  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) => set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),
  removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

  setHighlights: (highlights) => set({ highlights }),
  addHighlight: (highlight) => set((s) => ({ highlights: [...s.highlights, highlight] })),
  removeHighlight: (id) => set((s) => ({ highlights: s.highlights.filter((h) => h.id !== id) })),

  setAnnotations: (annotations) => set({ annotations }),
  addAnnotation: (annotation) => set((s) => ({ annotations: [...s.annotations, annotation] })),
  updateAnnotation: (id, content) =>
    set((s) => ({
      annotations: s.annotations.map((a) =>
        a.id === id ? { ...a, content, updatedAt: new Date().toISOString() } : a
      ),
    })),
  removeAnnotation: (id) => set((s) => ({ annotations: s.annotations.filter((a) => a.id !== id) })),

  setSearchQuery: (query) => set((s) => ({ search: { ...s.search, query } })),
  setSearchResults: (search) => set({ search }),
  clearSearch: () => set({ search: initialSearchState }),

  setSelectedText: (selectedText) => set({ selectedText }),

  reset: () =>
    set({
      paperId: null,
      meta: null,
      outline: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      zoom: 100,
      bookmarks: [],
      highlights: [],
      annotations: [],
      search: initialSearchState,
      selectedText: null,
    }),
}));
