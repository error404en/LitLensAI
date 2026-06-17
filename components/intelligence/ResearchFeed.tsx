import { ProjectActivity } from "../../lib/types";
import { ResearchEvent } from "./ResearchEvent";

interface ResearchFeedProps {
  feed: ProjectActivity[] | undefined;
}

export function ResearchFeed({ feed }: ResearchFeedProps) {
  if (!feed || feed.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl bg-surface/30">
        No recent activity in this project.
      </div>
    );
  }

  return (
    <div className="bg-surface/30 border rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-6">Research Feed</h3>
      <div className="space-y-0 pl-1">
        {feed.map((event) => (
          <ResearchEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
