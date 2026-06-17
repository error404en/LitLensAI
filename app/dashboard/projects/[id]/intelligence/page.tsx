"use client";

import React, { use } from "react";
import { ResearchWorkspace } from "../../../../../components/workspace/ResearchWorkspace/ResearchWorkspace";

export default function IntelligenceHubPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  // Render the new Phase 12B Research Workspace
  return <ResearchWorkspace projectId={projectId} />;
}
