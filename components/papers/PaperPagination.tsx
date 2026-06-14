import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PaperPagination() {
  const { currentPage, totalPages, setCurrentPage, totalPapersCount, itemsPerPage } = usePapers()

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalPapersCount)

  return (
    <div className="flex items-center justify-between border-t border-border px-2 py-4 mt-6">
      <div className="flex flex-1 items-center justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
            <span className="font-medium text-foreground">{endItem}</span> of{" "}
            <span className="font-medium text-foreground">{totalPapersCount}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-input hover:bg-accent focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // Simple pagination rendering, show first, last, and around current
              if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-input focus:z-20 focus:outline-offset-0 ${
                      currentPage === page
                        ? "z-10 bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {page}
                  </button>
                )
              }
              // Render ellipsis
              if (page === 2 && currentPage > 3) {
                return <span key="start-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-inset ring-input">...</span>
              }
              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                return <span key="end-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-inset ring-input">...</span>
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-input hover:bg-accent focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
