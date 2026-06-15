import * as React from "react"
import { useProjectActivity } from "../../hooks/useProjectActivity"
import { ActivityType } from "../../lib/types"
import { formatDate } from "../../lib/utils"
import { FilePlus, FileMinus, Sparkles, MessageSquare, FolderPlus, Activity as ActivityIcon } from "lucide-react"

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "project_created": return <FolderPlus className="h-4 w-4 text-blue-500" />
    case "paper_added": return <FilePlus className="h-4 w-4 text-green-500" />
    case "paper_removed": return <FileMinus className="h-4 w-4 text-red-500" />
    case "summary_generated":
    case "review_generated": return <Sparkles className="h-4 w-4 text-purple-500" />
    case "chat_started": return <MessageSquare className="h-4 w-4 text-amber-500" />
    default: return <ActivityIcon className="h-4 w-4 text-muted-foreground" />
  }
}

export function ProjectSidebar({ projectId }: { projectId: string }) {
  const { activities, isLoading } = useProjectActivity(projectId)

  return (
    <div className="p-6">
      <h3 className="font-semibold text-sm text-foreground mb-6 uppercase tracking-wider">Activity Timeline</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-border animate-pulse" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-3/4 bg-border animate-pulse" />
                <div className="h-2 w-1/4 bg-border animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="relative border-l border-border ml-3 space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative pl-6">
              <div className="absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex flex-col gap-0.5 pt-1">
                <p className="text-sm font-medium text-foreground">{activity.description}</p>
                <time className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
