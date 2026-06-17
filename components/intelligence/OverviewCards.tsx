import { BookOpen, FileText, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { ProjectHealthMetrics } from "../../services/project-health.service";

interface OverviewCardsProps {
  health: ProjectHealthMetrics | undefined;
}

export function OverviewCards({ health }: OverviewCardsProps) {
  if (!health) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total Papers */}
      <div className="bg-surface border rounded-xl p-4 flex flex-col">
        <div className="flex items-center text-muted-foreground mb-2">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Total Papers</span>
        </div>
        <div className="text-3xl font-semibold">{health.totalPapers}</div>
        <div className="text-xs text-muted-foreground mt-1">In this project</div>
      </div>

      {/* Processed */}
      <div className="bg-surface border rounded-xl p-4 flex flex-col">
        <div className="flex items-center text-muted-foreground mb-2">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Processed</span>
        </div>
        <div className="text-3xl font-semibold">{health.processedPapers}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {health.pendingPapers > 0 ? `${health.pendingPapers} pending` : 'All ready'}
        </div>
      </div>

      {/* AI Conversations */}
      <div className="bg-surface border rounded-xl p-4 flex flex-col">
        <div className="flex items-center text-muted-foreground mb-2">
          <MessageSquare className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">AI Interactions</span>
        </div>
        <div className="text-3xl font-semibold">{health.aiUsageCount}</div>
        <div className="text-xs text-muted-foreground mt-1">Messages sent</div>
      </div>

      {/* Est. Reading Time */}
      <div className="bg-surface border rounded-xl p-4 flex flex-col">
        <div className="flex items-center text-muted-foreground mb-2">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Est. Read Time</span>
        </div>
        <div className="text-3xl font-semibold">
          {health.averageReadingTimeMinutes > 60 
            ? `${(health.averageReadingTimeMinutes / 60).toFixed(1)}h` 
            : `${health.averageReadingTimeMinutes}m`}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Based on text volume</div>
      </div>
    </div>
  );
}
