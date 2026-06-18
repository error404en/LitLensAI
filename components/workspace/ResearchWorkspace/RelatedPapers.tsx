import { FileText, Plus, ExternalLink } from "lucide-react";
import { useRelatedPapers } from "../../../hooks/useRelatedPapers";

interface RelatedPapersProps {
  projectId: string;
  sourcePaperId?: string | null;
}

export function RelatedPapers({ projectId, sourcePaperId }: RelatedPapersProps) {
  const { data: papers } = useRelatedPapers(projectId, sourcePaperId);

  if (!papers || papers.length === 0) return null;

  return (
    <div className="bg-surface/30 border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Related Papers</h3>
        <span className="text-xs text-muted-foreground">Found via Semantic Search</span>
      </div>

      <div className="space-y-3">
        {papers.map((paper) => (
          <div key={paper.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:border-primary/50 transition-colors group">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-10 w-10 rounded bg-surface border flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {paper.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {paper.authors?.[0]?.name || "Unknown"} • Similarity: 89%
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 bg-surface hover:bg-muted border rounded-md text-muted-foreground">
                <Plus className="h-4 w-4" />
              </button>
              <button className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
