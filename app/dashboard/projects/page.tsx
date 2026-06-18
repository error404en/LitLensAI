"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useProjects } from "../../../hooks/useProjects"
import { ProjectGrid } from "../../../components/projects/ProjectGrid"
import { ProjectList } from "../../../components/projects/ProjectList"
import { ProjectToolbar } from "../../../components/projects/ProjectToolbar"
import { ProjectSkeleton } from "../../../components/projects/ProjectSkeleton"
import { ProjectEmptyState } from "../../../components/projects/ProjectEmptyState"
import { CreateProjectDialog } from "../../../components/projects/CreateProjectDialog"
import { RenameProjectDialog } from "../../../components/projects/RenameProjectDialog"
import { ConfirmDialog } from "../../../components/ui/confirm-dialog"
import { ErrorState } from "../../../components/ui/error-state"

export default function ProjectsPage() {
  const router = useRouter()
  const { 
    projects, 
    viewMode, 
    isLoading, 
    error, 
    refresh, 
    createProject,
    deleteProject,
    archiveProject,
    toggleFavorite,
    renameProject
  } = useProjects()
  
  // Dialog states
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null)
  const [projectToArchive, setProjectToArchive] = React.useState<string | null>(null)
  const [projectToRename, setProjectToRename] = React.useState<string | null>(null)

  // Handlers
  const handleOpen = (id: string) => router.push(`/dashboard/projects/${id}`)
  const handleRename = (id: string) => setProjectToRename(id)

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6 max-w-[1600px] mx-auto w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Research Workspace</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Organize your papers, generate literature reviews, and chat with your sources.
        </p>
      </div>

      <ProjectToolbar onCreateClick={() => router.push('/dashboard/projects/new')} />

      <div className="mt-4 min-h-[400px]">
        {isLoading && projects.length === 0 ? (
          <ProjectSkeleton viewMode={viewMode} />
        ) : error ? (
          <ErrorState 
            title="Failed to load projects" 
            description={error} 
            onRetry={refresh} 
          />
        ) : projects.length === 0 ? (
          <ProjectEmptyState onCreateClick={() => router.push('/dashboard/projects/new')} />
        ) : (
          <div className="animate-in fade-in-50 duration-500">
            {viewMode === "grid" ? (
              <ProjectGrid 
                projects={projects} 
                onOpen={handleOpen}
                onFavorite={toggleFavorite}
                onRename={handleRename}
                onArchive={setProjectToArchive}
                onDelete={setProjectToDelete}
              />
            ) : (
              <ProjectList 
                projects={projects} 
                onOpen={handleOpen}
                onFavorite={toggleFavorite}
                onRename={handleRename}
                onArchive={setProjectToArchive}
                onDelete={setProjectToDelete}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => projectToDelete && deleteProject(projectToDelete)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This will permanently remove all associated notes, summaries, and configurations. Attached papers will not be deleted from your library."
        confirmText="Delete Project"
        isDestructive={true}
      />

      <ConfirmDialog
        isOpen={!!projectToArchive}
        onClose={() => setProjectToArchive(null)}
        onConfirm={() => projectToArchive && archiveProject(projectToArchive)}
        title="Archive Project"
        description="Are you sure you want to archive this project? It will be hidden from the active workspace but can be restored later."
        confirmText="Archive Project"
      />

      <RenameProjectDialog
        isOpen={!!projectToRename}
        onClose={() => setProjectToRename(null)}
        currentName={projects.find(p => p.id === projectToRename)?.title || ""}
        onRename={async (newName) => {
          if (projectToRename) {
            await renameProject(projectToRename, newName)
          }
        }}
      />
    </div>
  )
}
