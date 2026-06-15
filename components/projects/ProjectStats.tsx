import * as React from "react"
import { ProjectStats } from "../../lib/types"
import { Card, CardContent } from "../ui/card"
import { FileText, Sparkles, Clock, CheckCircle } from "lucide-react"
import { formatDate } from "../../lib/utils"

export function ProjectStatsDisplay({ stats, updatedAt }: { stats: ProjectStats, updatedAt: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Papers Attached</p>
            <h3 className="text-2xl font-bold">{stats.paperCount}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Processed</p>
            <h3 className="text-2xl font-bold">{stats.completionPercentage}%</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">AI Readiness</p>
            <h3 className="text-lg font-bold capitalize">{stats.aiStatus}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
            <h3 className="text-sm font-bold truncate" title={formatDate(updatedAt)}>
              {formatDate(updatedAt).split(' at')[0]}
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
