import { Pin, ArrowRight } from "lucide-react";
import { useWorkspaceStore } from "../../../stores/workspace.store";
import { useInsights } from "../../../hooks/useInsights";

interface PinnedInsightsProps {
  projectId: string;
}

export function PinnedInsights({ projectId }: PinnedInsightsProps) {
  const { pinnedInsights } = useWorkspaceStore();
  const { insights } = useInsights(projectId);

  if (!insights || pinnedInsights.length === 0) return null;

  // Filter insights that are actively pinned in the local store
  const activePinned = insights.filter(i => pinnedInsights.includes(i.type));

  if (activePinned.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
      <div className="flex items-center space-x-2 mb-4 text-primary">
        <Pin className="h-4 w-4" />
        <h3 className="font-semibold text-sm">Pinned Insights</h3>
      </div>
      
      <div className="space-y-3">
        {activePinned.map((insight) => (
          <div key={insight.id} className="p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors group cursor-pointer">
            <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {insight.content}
            </p>
            <div className="flex items-center text-[10px] font-semibold text-primary uppercase tracking-wider group-hover:underline">
              Expand <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
