import { useCallback } from "react";
import { usePDFStore } from "../stores/pdf.store";
import { PDFService } from "../services/pdf.service";
import { HighlightColor } from "../lib/types/pdf";

export function usePDFAnnotations() {
  const store = usePDFStore();

  const addHighlight = useCallback(
    async (page: number, text: string, color: HighlightColor, startOffset: number, endOffset: number) => {
      if (!store.paperId) return;
      try {
        const hl = await PDFService.addHighlight(store.paperId, page, text, color, startOffset, endOffset);
        store.addHighlight(hl);
        store.setSelectedText(null);
      } catch (err) {
        console.error("Failed to add highlight:", err);
      }
    },
    [store]
  );

  const removeHighlight = useCallback(
    async (id: string) => {
      try {
        await PDFService.removeHighlight(id);
        store.removeHighlight(id);
      } catch (err) {
        console.error("Failed to remove highlight:", err);
      }
    },
    [store]
  );

  const addAnnotation = useCallback(
    async (page: number, content: string, highlightId?: string) => {
      if (!store.paperId) return;
      try {
        const note = await PDFService.addAnnotation(store.paperId, page, content, highlightId);
        store.addAnnotation(note);
      } catch (err) {
        console.error("Failed to add annotation:", err);
      }
    },
    [store]
  );

  const editAnnotation = useCallback(
    async (id: string, content: string) => {
      try {
        await PDFService.editAnnotation(id, content);
        store.updateAnnotation(id, content);
      } catch (err) {
        console.error("Failed to edit annotation:", err);
      }
    },
    [store]
  );

  const deleteAnnotation = useCallback(
    async (id: string) => {
      try {
        await PDFService.deleteAnnotation(id);
        store.removeAnnotation(id);
      } catch (err) {
        console.error("Failed to delete annotation:", err);
      }
    },
    [store]
  );

  const addBookmark = useCallback(
    async (page: number, label?: string) => {
      if (!store.paperId) return;
      try {
        const bm = await PDFService.bookmarkPage(store.paperId, page, label);
        store.addBookmark(bm);
      } catch (err) {
        console.error("Failed to add bookmark:", err);
      }
    },
    [store]
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      try {
        await PDFService.removeBookmark(id);
        store.removeBookmark(id);
      } catch (err) {
        console.error("Failed to remove bookmark:", err);
      }
    },
    [store]
  );

  return {
    highlights: store.highlights,
    annotations: store.annotations,
    bookmarks: store.bookmarks,
    selectedText: store.selectedText,
    setSelectedText: store.setSelectedText,
    addHighlight,
    removeHighlight,
    addAnnotation,
    editAnnotation,
    deleteAnnotation,
    addBookmark,
    removeBookmark,
  };
}
