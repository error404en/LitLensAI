"use client";

import React, { use } from "react";
import { ResearchWorkspace } from "../../../../../components/workspace/ResearchWorkspace/ResearchWorkspace";

export default function IntelligenceHubPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;

  // Render the new Phase 12B Research Workspace
  return <ResearchWorkspace projectId={projectId} />;
}
