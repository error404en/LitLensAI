"use client";

import * as React from "react";
import { useProjects } from "../../../hooks/useProjects";
import { usePapers } from "../../../hooks/usePapers";
import { analyzeGapsAction } from "../../actions/ai.actions";
import { Button } from "../../../components/ui/button";
import { ErrorState } from "../../../components/ui/error-state";
import { Loader2, Copy, Check, Sparkles, BookOpen, AlertCircle, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ResearchGapsPage() {
  const { projects, isLoading: isProjectsLoading, error: projectsError } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Fetch papers for the selected project
  const { papers, isLoading: isPapersLoading } = usePapers(selectedProjectId || undefined);

  const selectedProject = React.useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const handleAnalyze = async () => {
    if (!selectedProjectId) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const response = await analyzeGapsAction(selectedProjectId);
      if (typeof response === "object" && response !== null && "error" in response) {
        setAnalysisResult(`**Error:** ${(response as { error: string }).error}`);
      } else {
        setAnalysisResult(typeof response === "string" ? response : JSON.stringify(response, null, 2));
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("An unexpected error occurred during gap analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isProjectsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading projects...</span>
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="flex-1 p-4 sm:p-8">
        <ErrorState title="Failed to load projects" description={projectsError} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6 max-w-[1600px] mx-auto w-full">
      <div className="mb-2">
        <h2 className="text-3xl font-bold tracking-tight">Research Gap Finder</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Select a project to analyze literature limits, contradictions, and unexplored research gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Selector & Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-surface/30 border border-outline-variant/60 rounded-xl p-5 shadow-sm space-y-4">
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Select Research Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setAnalysisResult(null);
              }}
              className="w-full h-10 px-3 bg-background border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">-- Choose a Project --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            {selectedProject && (
              <div className="pt-4 border-t border-outline-variant/60 space-y-4 animate-in fade-in-50 duration-300">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Project Description
                  </h4>
                  <p className="text-sm mt-1.5 text-on-surface/80 leading-relaxed">
                    {selectedProject.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Attached Papers ({papers.length})
                  </h4>
                  {isPapersLoading ? (
                    <div className="text-xs text-muted-foreground py-2 flex items-center">
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      Loading papers...
                    </div>
                  ) : papers.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs rounded-lg border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>No papers attached. Go to <strong>My Projects</strong> to attach papers.</span>
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {papers.map((paper) => (
                        <div
                          key={paper.id}
                          className="flex items-center gap-2 p-2 border border-outline-variant/50 rounded-lg bg-surface/50 text-xs truncate"
                        >
                          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate font-medium flex-1">{paper.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || papers.length === 0}
                  className="w-full cursor-pointer h-10"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing Gaps...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Find Research Gaps
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Report */}
        <div className="lg:col-span-2">
          <div className="bg-surface/30 border border-outline-variant/60 rounded-xl min-h-[450px] flex flex-col shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex-none px-6 py-4 border-b border-outline-variant/60 bg-surface/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Gap Analysis Report</span>
              </div>
              {analysisResult && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-surface-variant rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Report
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Content Canvas */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[700px] custom-scrollbar">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-sm">AI Orchestrator is analyzing project context...</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      This will scan paper objectives, limitations, and future work to isolate research gaps.
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-on-surface-variant">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-muted-foreground text-center space-y-2">
                  <Sparkles className="h-10 w-10 text-muted-foreground/30" />
                  <h3 className="font-medium">No Analysis Generated</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mt-1">
                    Choose a project from the left panel and click <strong>Find Research Gaps</strong> to start AI-assisted gap detection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
