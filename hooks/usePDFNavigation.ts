import { useCallback } from "react";
import { usePDFStore } from "../stores/pdf.store";

export function usePDFNavigation() {
  const store = usePDFStore();
  const totalPages = store.meta?.totalPages || 1;

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      store.setCurrentPage(clamped);
    },
    [totalPages, store]
  );

  const nextPage = useCallback(() => goToPage(store.currentPage + 1), [store.currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(store.currentPage - 1), [store.currentPage, goToPage]);
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [totalPages, goToPage]);

  const zoomIn = useCallback(() => store.setZoom(store.zoom + 25), [store]);
  const zoomOut = useCallback(() => store.setZoom(store.zoom - 25), [store]);
  const fitWidth = useCallback(() => store.setZoom(100), [store]);
  const fitPage = useCallback(() => store.setZoom(75), [store]);

  const readingProgress = totalPages > 0 ? Math.round((store.currentPage / totalPages) * 100) : 0;

  return {
    currentPage: store.currentPage,
    totalPages,
    zoom: store.zoom,
    readingProgress,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    zoomIn,
    zoomOut,
    fitWidth,
    fitPage,
    setZoom: store.setZoom,
    toggleLeftSidebar: store.toggleLeftSidebar,
    toggleRightSidebar: store.toggleRightSidebar,
    setLeftSidebarTab: store.setLeftSidebarTab,
    setRightSidebarTab: store.setRightSidebarTab,
  };
}
