import { FileText, Star, Clock, MoreVertical } from "lucide-react";
import { Paper } from "../../lib/types";
import { formatDistanceToNow } from "date-fns";

interface RecentPapersProps {
  papers: Paper[] | undefined;
}

export function RecentPapers({ papers }: RecentPapersProps) {
  if (!papers || papers.length === 0) return null;

  // Only show the 3 most recent papers
  const recentPapers = papers.slice(0, 3);

  return (
    <div className="bg-surface/30 border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Recent Papers</h3>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-2">
        {recentPapers.map((paper) => (
          <div key={paper.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group cursor-pointer border border-transparent hover:border-border">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-8 w-8 rounded bg-background border flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {paper.title}
                </span>
                <div className="flex items-center text-xs text-muted-foreground space-x-2">
                  <span className="truncate max-w-[120px]">
                    {paper.authors?.[0]?.name || "Unknown Author"}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(paper.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 text-muted-foreground hover:text-yellow-500 rounded-md">
                <Star className="h-4 w-4" />
              </button>
              <button className="p-1 text-muted-foreground hover:text-foreground rounded-md">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
