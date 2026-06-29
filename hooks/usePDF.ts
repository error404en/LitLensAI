import { useEffect } from "react";
import { usePDFStore } from "../stores/pdf.store";
import { PDFService } from "../services/pdf.service";

export function usePDF(paperId: string) {
  const meta = usePDFStore((s) => s.meta);
  const outline = usePDFStore((s) => s.outline);
  const isLoading = usePDFStore((s) => s.isLoading);
  const error = usePDFStore((s) => s.error);
  const currentPage = usePDFStore((s) => s.currentPage);
  const zoom = usePDFStore((s) => s.zoom);
  const bookmarks = usePDFStore((s) => s.bookmarks);
  const highlights = usePDFStore((s) => s.highlights);
  const annotations = usePDFStore((s) => s.annotations);
  const search = usePDFStore((s) => s.search);
  const selectedText = usePDFStore((s) => s.selectedText);
  const leftSidebarTab = usePDFStore((s) => s.leftSidebarTab);
  const rightSidebarTab = usePDFStore((s) => s.rightSidebarTab);
  const isLeftSidebarOpen = usePDFStore((s) => s.isLeftSidebarOpen);
  const isRightSidebarOpen = usePDFStore((s) => s.isRightSidebarOpen);
  
  const currentPaperId = usePDFStore((s) => s.paperId);

  useEffect(() => {
    if (paperId && currentPaperId !== paperId) {
      // Set paperId immediately to prevent concurrent loads
      usePDFStore.getState().setPaperId(paperId);

      const loadDocument = async () => {
        const {
          setLoading,
          setError,
          setMeta,
          setOutline,
          setBookmarks,
          setHighlights,
          setAnnotations,
        } = usePDFStore.getState();

        setLoading(true);
        setError(null);
        try {
          const { meta, outline } = await PDFService.loadPDF(paperId);
          setMeta(meta);
          setOutline(outline);

          const [bookmarks, highlights, annotations] = await Promise.all([
            PDFService.getBookmarks(paperId),
            PDFService.getHighlights(paperId),
            PDFService.getAnnotations(paperId),
          ]);
          setBookmarks(bookmarks);
          setHighlights(highlights);
          setAnnotations(annotations);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load document");
        } finally {
          setLoading(false);
        }
      };

      loadDocument();
    }
  }, [paperId, currentPaperId]);

  return {
    meta,
    outline,
    isLoading,
    error,
    currentPage,
    zoom,
    bookmarks,
    highlights,
    annotations,
    search,
    selectedText,
    leftSidebarTab,
    rightSidebarTab,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    setSelectedText: usePDFStore.getState().setSelectedText,
    setLeftSidebarTab: usePDFStore.getState().setLeftSidebarTab,
    setRightSidebarTab: usePDFStore.getState().setRightSidebarTab,
    reset: usePDFStore.getState().reset,
    refresh: () => {
      usePDFStore.getState().setPaperId(null);
    },
  };
}
