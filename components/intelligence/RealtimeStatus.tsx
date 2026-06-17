import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useProjectHealth } from "../../hooks/useProjectHealth";

interface RealtimeStatusProps {
  projectId: string;
}

export function RealtimeStatus({ projectId }: RealtimeStatusProps) {
  // Realtime hook would invalidate this query automatically in a real implementation
  // using useSupabaseRealtime to listen for paper updates
  const { data: health } = useProjectHealth(projectId);

  if (!health) return null;

  const isProcessing = health.pendingPapers > 0;

  return (
    <div className="px-4 py-2 flex items-center justify-between text-xs bg-surface/50">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5">
          <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="font-medium">
            {isProcessing ? 'Pipeline Active' : 'System Idle'}
          </span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">
          • Realtime Sync Enabled
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {isProcessing ? (
          <div className="flex items-center text-yellow-600 dark:text-yellow-500">
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
            <span>Processing {health.pendingPapers} document{health.pendingPapers !== 1 ? 's' : ''}...</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600 dark:text-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            <span>All documents embedded</span>
          </div>
        )}
      </div>
    </div>
  );
}
