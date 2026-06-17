import { Lightbulb, Pin, Bookmark } from "lucide-react";
import { useWorkspaceStore } from "../../../../stores/workspace.store";

export function KnowledgeHighlights() {
  const { pinnedInsights: _pinnedInsights } = useWorkspaceStore();

  return (
    <div className="bg-surface/30 border rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold text-lg">Knowledge Highlights</h3>
      </div>

      <div className="space-y-4">
        {/* Mocked Highlights */}
        <div className="p-4 border border-dashed rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
            <Bookmark className="h-3 w-3" />
            <span>Note on Methodology</span>
            <span>•</span>
            <span>2 days ago</span>
          </div>
          <p className="text-sm">
            &quot;The use of multi-head attention drastically reduces the recurrence bottleneck seen in traditional LSTMs.&quot;
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-surface relative group hover:bg-muted transition-colors cursor-pointer">
          <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
            <Pin className="h-3 w-3" />
            <span>Pinned Insight</span>
            <span>•</span>
            <span>Research Trends</span>
          </div>
          <p className="text-sm font-medium">
            There is a significant shift towards memory-efficient transformers in edge devices.
          </p>
        </div>
      </div>
    </div>
  );
}
