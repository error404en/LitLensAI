import { useCallback } from "react";
import { usePDFStore } from "../stores/pdf.store";
import { PDFService } from "../services/pdf.service";

export function usePDFSearch() {
  const store = usePDFStore();

  const performSearch = useCallback(
    async (query: string) => {
      if (!store.paperId) return;
      store.setSearchResults({ query, results: [], currentIndex: -1, isSearching: true });
      try {
        const results = await PDFService.search(store.paperId, query);
        store.setSearchResults({ query, results, currentIndex: results.length > 0 ? 0 : -1, isSearching: false });
        if (results.length > 0) {
          store.setCurrentPage(results[0].page);
        }
      } catch (err) {
        store.setSearchResults({ query, results: [], currentIndex: -1, isSearching: false });
      }
    },
    [store]
  );

  const goToResult = useCallback(
    (index: number) => {
      const results = store.search.results;
      if (index >= 0 && index < results.length) {
        store.setSearchResults({ ...store.search, currentIndex: index });
        store.setCurrentPage(results[index].page);
      }
    },
    [store]
  );

  const nextResult = useCallback(() => {
    const { currentIndex, results } = store.search;
    if (results.length === 0) return;
    goToResult((currentIndex + 1) % results.length);
  }, [store.search, goToResult]);

  const prevResult = useCallback(() => {
    const { currentIndex, results } = store.search;
    if (results.length === 0) return;
    goToResult(currentIndex <= 0 ? results.length - 1 : currentIndex - 1);
  }, [store.search, goToResult]);

  return {
    search: store.search,
    performSearch,
    goToResult,
    nextResult,
    prevResult,
    clearSearch: store.clearSearch,
  };
}
