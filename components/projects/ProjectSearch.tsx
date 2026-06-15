"use client"

import * as React from "react"
import { useProjects } from "../../hooks/useProjects"
import { Search } from "../ui/search"

export function ProjectSearch() {
  const { searchQuery, setSearchQuery } = useProjects()
  const [localValue, setLocalValue] = React.useState(searchQuery)

  React.useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [localValue, setSearchQuery])

  return (
    <Search
      placeholder="Search projects..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      className="w-full max-w-sm"
    />
  )
}
