"use client"

import * as React from "react"
import { Textarea } from "../ui/textarea"
import { Save, Clock, Download } from "lucide-react"
import { Project } from "../../lib/types"
import { formatDate } from "../../lib/utils"

export function ProjectNotesEditor({ project }: { project: Project }) {
  const [content, setContent] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)

  // Load mock data
  React.useEffect(() => {
    setContent(`# ${project.title} Notes\n\nBegin typing here...`)
  }, [project.title])

  // Mock autosave
  React.useEffect(() => {
    if (!content) return
    const handler = setTimeout(() => {
      setIsSaving(true)
      // Simulate save delay
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 500)
    }, 1500)
    return () => clearTimeout(handler)
  }, [content])

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            {isSaving ? (
              <Save className="h-3.5 w-3.5 animate-pulse text-primary" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{isSaving ? "Saving..." : "Saved"}</span>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Clock className="h-3.5 w-3.5" />
              <span>Last edited {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span className="hidden sm:inline-block">{charCount} characters</span>
          <button 
            className="ml-2 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Export notes"
            title="Export as Markdown"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-0 overflow-hidden relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your research notes..."
          className="w-full h-full resize-none border-0 focus-visible:ring-0 p-6 md:p-8 text-base leading-relaxed font-mono bg-transparent rounded-none"
        />
      </div>
    </div>
  )
}
