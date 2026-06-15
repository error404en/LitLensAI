import * as React from "react";
import { usePDFSearch } from "../../hooks/usePDFSearch";
import { Button } from "../ui/button";
import { Search as SearchIcon, ChevronUp, ChevronDown, X } from "lucide-react";

export function PDFSearch() {
  const { search, performSearch, nextResult, prevResult, clearSearch } = usePDFSearch();
  const [query, setQuery] = React.useState(search.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="p-3 space-y-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search in document..."
            className="w-full h-8 pl-8 pr-3 text-sm border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search in document"
          />
        </div>
        {search.query && (
          <Button variant="ghost" size="icon" onClick={() => { clearSearch(); setQuery(""); }} aria-label="Clear search">
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {search.results.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{search.currentIndex + 1} of {search.results.length} matches</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevResult} aria-label="Previous match" className="h-6 w-6">
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextResult} aria-label="Next match" className="h-6 w-6">
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {search.query && search.results.length === 0 && !search.isSearching && (
        <p className="text-xs text-muted-foreground text-center py-4">No results found</p>
      )}

      {search.isSearching && (
        <p className="text-xs text-muted-foreground text-center py-4 animate-pulse">Searching...</p>
      )}

      {/* Results list */}
      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
        {search.results.map((r, i) => (
          <button
            key={i}
            onClick={() => { /* goToResult handled via hook */ }}
            className={`text-left text-xs p-2 rounded-md transition-colors hover:bg-accent ${i === search.currentIndex ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
          >
            <span className="font-medium">Page {r.page}</span>
            <p className="truncate mt-0.5">{r.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
