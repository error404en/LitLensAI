import { formatDistanceToNow } from "date-fns";
import { FileUp, FileCheck, FileSearch, MessageSquare, Plus, Activity } from "lucide-react";
import { ProjectActivity } from "../../lib/types";

interface ResearchEventProps {
  event: ProjectActivity;
}

export function ResearchEvent({ event }: ResearchEventProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "paper_added": return <FileUp className="h-4 w-4 text-blue-500" />;
      case "paper_processed": return <FileCheck className="h-4 w-4 text-green-500" />;
      case "summary_generated": return <FileSearch className="h-4 w-4 text-purple-500" />;
      case "chat_started": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case "project_created": return <Plus className="h-4 w-4 text-indigo-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative pl-6 pb-6 border-l last:border-l-0 last:pb-0 border-muted">
      {/* Timeline Node */}
      <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border flex items-center justify-center">
        {getIcon(event.type)}
      </div>
      
      <div className="flex flex-col pt-0.5">
        <span className="text-sm font-medium">{event.description}</span>
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
