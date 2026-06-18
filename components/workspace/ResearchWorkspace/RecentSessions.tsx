import { formatDistanceToNow } from "date-fns";
import { MessageSquare, PlayCircle, Trash2, Star } from "lucide-react";
import { useRecentSessions } from "../../../hooks/useRecentSessions";

interface RecentSessionsProps {
  projectId: string;
}

export function RecentSessions({ projectId }: RecentSessionsProps) {
  const { data: sessions } = useRecentSessions(projectId);

  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="bg-surface/30 border rounded-xl p-6 mb-8">
      <h3 className="font-semibold text-lg mb-6">Recent AI Sessions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.slice(0, 4).map((session) => (
          <div key={session.id} className="p-4 bg-background border rounded-lg hover:border-border transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:text-yellow-500 rounded"><Star className="h-3 w-3" /></button>
                <button className="p-1 hover:text-destructive rounded"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
            
            <p className="text-sm font-medium mb-4 line-clamp-2">
              {/* Note: Mock title, real DB needs a title field on conversations */}
              Discussion on Attention Mechanisms
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                GPT-4o • 1.2k tokens
              </div>
              <button className="flex items-center text-xs font-medium text-primary hover:underline">
                <PlayCircle className="h-3 w-3 mr-1" /> Resume
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
