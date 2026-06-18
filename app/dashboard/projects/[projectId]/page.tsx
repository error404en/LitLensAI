"use client"

import * as React from "react"
import { useProject } from "../../../../hooks/useProject"
import { ProjectHeader } from "../../../../components/projects/ProjectHeader"
import { ProjectOverview } from "../../../../components/projects/ProjectOverview"
import { ProjectTabs } from "../../../../components/projects/ProjectTabs"
import { ProjectSidebar } from "../../../../components/projects/ProjectSidebar"
import { ProjectPaperList } from "../../../../components/projects/ProjectPaperList"
import { ErrorState } from "../../../../components/ui/error-state"
import { Loading } from "../../../../components/ui/loading"

import { ProjectNotesEditor } from "../../../../components/projects/ProjectNotesEditor"
import { useSearchParams, useRouter } from "next/navigation"

export default function SingleProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const unwrappedParams = React.use(params)
  const { project, isLoading, error, refresh } = useProject(unwrappedParams.projectId)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const defaultTab = searchParams.get('tab') || "overview"
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  React.useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.replace(`/dashboard/projects/${unwrappedParams.projectId}?tab=${tabId}`)
  }

  if (isLoading && !project) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Loading workspace..." />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-8">
        <ErrorState 
          title="Project not found" 
          description={error || "The project you are looking for does not exist."} 
          onRetry={refresh} 
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full max-w-[1800px] mx-auto w-full">
      <ProjectHeader project={project} />
      
      <div className="px-4 sm:px-8 border-b border-border">
        <ProjectTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === "overview" && <ProjectOverview project={project} />}
          {activeTab === "papers" && <ProjectPaperList projectId={project.id} />}
          {activeTab === "notes" && (
            <div className="h-full min-h-[500px]">
              <ProjectNotesEditor project={project} />
            </div>
          )}
          {activeTab === "chat" && (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-12 text-muted-foreground">
              AI Chat Component placeholder
            </div>
          )}
        </main>
        
        <aside className="hidden lg:block w-80 xl:w-96 border-l border-border bg-muted/10 overflow-y-auto">
          <ProjectSidebar projectId={project.id} />
        </aside>
      </div>
    </div>
  )
}
