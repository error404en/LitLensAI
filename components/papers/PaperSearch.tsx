"use client"

import * as React from "react"
import { usePapers } from "../../hooks/usePapers"
import { Search } from "../ui/search"

export function PaperSearch() {
  const { searchQuery, setSearchQuery } = usePapers()
  const [localValue, setLocalValue] = React.useState(searchQuery)

  React.useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  // Debounce the search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localValue)
    }, 300)

    return () => clearTimeout(handler)
  }, [localValue, setSearchQuery])

  return (
    <Search
      placeholder="Search papers by title, author, abstract..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      className="w-full max-w-sm"
    />
  )
}
