import { formatDistanceToNow } from "date-fns";
import { Activity, FileUp, FileCheck, Search, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TimelineService } from "../../../services/timeline.service";
// unused

interface ResearchTimelineProps {
  projectId: string;
}

export function ResearchTimeline({ projectId }: ResearchTimelineProps) {
  const { data: timeline } = useQuery({
    queryKey: ["research-timeline", projectId],
    queryFn: () => TimelineService.getTimeline(projectId),
    enabled: !!projectId,
  });

  if (!timeline || timeline.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "paper_added": return <FileUp className="h-4 w-4 text-blue-500" />;
      case "paper_processed": return <FileCheck className="h-4 w-4 text-green-500" />;
      case "summary_generated": return <Search className="h-4 w-4 text-purple-500" />;
      case "chat_started": return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-surface/30 border rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-8">Journey Timeline</h3>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {timeline.map((group, groupIdx) => (
          <div key={groupIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline Item */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
              {getIcon(group.events[0]?.type)}
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-surface/50 hover:bg-surface transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{group.date}</span>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                  {group.events.length} events
                </span>
              </div>
              <div className="space-y-3">
                {group.events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex flex-col">
                    <span className="text-sm">{event.description}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))}
                {group.events.length > 3 && (
                  <button className="text-xs text-primary hover:underline font-medium">
                    View {group.events.length - 3} more
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
