import * as React from "react"
import { cn } from "../../lib/utils"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "papers", label: "Papers & Sources" },
  { id: "notes", label: "Notes" },
  { id: "chat", label: "AI Chat" },
  { id: "compare", label: "Compare" },
]

interface ProjectTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
