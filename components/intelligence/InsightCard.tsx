import { ChevronDown, ChevronUp, Pin, Save, RefreshCw, Loader2 } from "lucide-react";
import { useIntelligenceStore } from "../../stores/intelligence.store";

interface InsightCardProps {
  id: string;
  title: string;
  content: string | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onPin?: () => void;
  onSave?: () => void;
}

export function InsightCard({ id, title, content, isLoading, onRefresh, onPin, onSave }: InsightCardProps) {
  const { expandedCards, toggleCardExpansion } = useIntelligenceStore();
  const isExpanded = expandedCards.includes(id);

  return (
    <div className="border rounded-xl bg-surface/50 overflow-hidden transition-all duration-200">
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface"
        onClick={() => toggleCardExpansion(id)}
      >
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="flex items-center space-x-2 text-muted-foreground">
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-3">
          {isLoading && !content ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-xs">Generating AI insights...</p>
            </div>
          ) : content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              {content}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              Click refresh to generate this insight.
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 mt-4 pt-2 border-t">
            <button 
              onClick={(e) => { e.stopPropagation(); onRefresh?.(); }}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors"
              title="Regenerate"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin opacity-50' : ''}`} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onSave?.(); }}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors"
              title="Save to Notes"
            >
              <Save className="h-4 w-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onPin?.(); }}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors"
              title="Pin to Dashboard"
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
