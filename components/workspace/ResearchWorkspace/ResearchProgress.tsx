import { useResearchProgress } from "../../../../hooks/useResearchProgress";

interface ResearchProgressProps {
  projectId: string;
}

export function ResearchProgress({ projectId }: ResearchProgressProps) {
  const { data: progress } = useResearchProgress(projectId);

  if (!progress) return null;

  return (
    <div className="bg-surface/30 border rounded-xl p-4">
      <h3 className="font-semibold text-sm mb-4">Project Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Papers Processed</span>
            <span className="font-medium">{progress.papersProcessed} / {progress.totalPapers}</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Reading Progress</span>
            <span className="font-medium">{progress.readingProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${progress.readingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-background border rounded-lg p-2 text-center">
            <div className="text-lg font-semibold">{progress.annotationsCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Notes</div>
          </div>
          <div className="bg-background border rounded-lg p-2 text-center">
            <div className="text-lg font-semibold">{progress.comparisonsCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Comparisons</div>
          </div>
        </div>
      </div>
    </div>
  );
}
