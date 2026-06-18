import { useEffect, useCallback } from "react";
import { usePDFStore } from "../stores/pdf.store";
import { PDFService } from "../services/pdf.service";

export function usePDF(paperId: string) {
  const store = usePDFStore();

  const loadDocument = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    store.setPaperId(paperId);
    try {
      const { meta, outline } = await PDFService.loadPDF(paperId);
      store.setMeta(meta);
      store.setOutline(outline);

      const [bookmarks, highlights, annotations] = await Promise.all([
        PDFService.getBookmarks(paperId),
        PDFService.getHighlights(paperId),
        PDFService.getAnnotations(paperId),
      ]);
      store.setBookmarks(bookmarks);
      store.setHighlights(highlights);
      store.setAnnotations(annotations);
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Failed to load document");
    } finally {
      store.setLoading(false);
    }
  }, [paperId, store]);

  const reset = store.reset;
  useEffect(() => {
    loadDocument();
    return () => reset();
  }, [loadDocument, reset]);

  return {
    meta: store.meta,
    outline: store.outline,
    isLoading: store.isLoading,
    error: store.error,
    currentPage: store.currentPage,
    zoom: store.zoom,
    bookmarks: store.bookmarks,
    highlights: store.highlights,
    annotations: store.annotations,
    search: store.search,
    selectedText: store.selectedText,
    leftSidebarTab: store.leftSidebarTab,
    rightSidebarTab: store.rightSidebarTab,
    isLeftSidebarOpen: store.isLeftSidebarOpen,
    isRightSidebarOpen: store.isRightSidebarOpen,
    setSelectedText: store.setSelectedText,
    setLeftSidebarTab: store.setLeftSidebarTab,
    setRightSidebarTab: store.setRightSidebarTab,
    refresh: loadDocument,
  };
}
