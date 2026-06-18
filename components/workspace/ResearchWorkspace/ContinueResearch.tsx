import { BookOpen, Edit3, Archive } from "lucide-react";
import { useActionCenter } from "../../../hooks/useActionCenter";

interface ContinueResearchProps {
  projectId: string;
}

export function ContinueResearch({ projectId }: ContinueResearchProps) {
  const { data: actions } = useActionCenter(projectId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-surface/50 border rounded-xl p-5 hover:bg-surface transition-colors cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Resume</span>
        </div>
        <h4 className="font-medium text-sm mb-1">Last Opened Paper</h4>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {actions?.lastOpenedPaperId ? "Attention Is All You Need" : "No papers opened yet."}
        </p>
      </div>

      <div className="bg-surface/50 border rounded-xl p-5 hover:bg-surface transition-colors cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Edit3 className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Review</span>
        </div>
        <h4 className="font-medium text-sm mb-1">Pending Annotations</h4>
        <p className="text-xs text-muted-foreground">
          3 notes require review
        </p>
      </div>

      <div className="bg-surface/50 border rounded-xl p-5 hover:bg-surface transition-colors cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <Archive className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Action</span>
        </div>
        <h4 className="font-medium text-sm mb-1">Unread Papers</h4>
        <p className="text-xs text-muted-foreground">
          {actions?.unreadPapers || 0} papers ready to read
        </p>
      </div>
    </div>
  );
}
