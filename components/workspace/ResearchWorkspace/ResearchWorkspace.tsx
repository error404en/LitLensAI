"use client";

import React from "react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceFooter } from "./WorkspaceFooter";
import { ResearchProgress } from "./ResearchProgress";
import { ActionCenter } from "./ActionCenter";
import { ContinueResearch } from "./ContinueResearch";
import { ResearchSuggestions } from "./ResearchSuggestions";
import { KnowledgeHighlights } from "./KnowledgeHighlights";
import { RecentSessions } from "./RecentSessions";
import { RelatedPapers } from "./RelatedPapers";
import { ResearchTimeline } from "./ResearchTimeline";
import { PinnedInsights } from "./PinnedInsights";
import { useWorkspace } from "../../../hooks/useWorkspace";
import { EmptyState } from "../../intelligence/EmptyState";
import { LoadingSkeleton } from "../../intelligence/LoadingSkeleton";
import { useWorkspaceStore } from "../../../stores/workspace.store";

interface ResearchWorkspaceProps {
  projectId: string;
}

export function ResearchWorkspace({ projectId }: ResearchWorkspaceProps) {
  const { data: workspace, isLoading } = useWorkspace(projectId);
  const { selectedView } = useWorkspaceStore();

  if (isLoading) return <LoadingSkeleton />;
  if (!workspace || !workspace.project) {
    return <EmptyState title="Workspace Unavailable" message="Could not load the research workspace." />;
  }

  // Left Sidebar: Progress and Timeline
  const leftSidebar = (
    <aside className="w-64 flex-none border-r bg-surface/30 overflow-y-auto hidden md:block">
      <div className="p-4 space-y-6">
        <ResearchProgress projectId={projectId} />
        {/* Placeholder for saved collections */}
        <div className="px-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Collections
          </h3>
          <div className="text-sm text-muted-foreground">No collections saved.</div>
        </div>
      </div>
    </aside>
  );

  // Right Sidebar: Action Center & Pinned Items
  const rightSidebar = (
    <aside className="w-80 flex-none border-l bg-surface/30 overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-6">
        <ActionCenter projectId={projectId} />
        <PinnedInsights projectId={projectId} />
      </div>
    </aside>
  );

  // Center Canvas: Dynamic based on selected view (Currently showing Overview)
  const centerCanvas = (
    <main className="flex-1 overflow-y-auto bg-background/50 relative">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {selectedView === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ContinueResearch projectId={projectId} />
            <ResearchSuggestions projectId={projectId} />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <KnowledgeHighlights />
              <RelatedPapers projectId={projectId} />
            </div>

            <RecentSessions projectId={projectId} />
            <ResearchTimeline projectId={projectId} />
          </div>
        )}

        {selectedView !== "overview" && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            View [{selectedView}] is under construction.
          </div>
        )}
      </div>
    </main>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background font-sans">
      <WorkspaceHeader project={workspace.project} />

      <div className="flex flex-1 overflow-hidden relative">
        {leftSidebar}
        {centerCanvas}
        {rightSidebar}
      </div>

      <WorkspaceFooter isProcessing={false} />
    </div>
  );
}
