import * as React from "react"
import { Project } from "../../lib/types"
import { Card, CardContent } from "../ui/card"
import { ProjectStatsDisplay } from "./ProjectStats"

export function ProjectOverview({ project }: { project: Project }) {
  const stats = project.stats || { paperCount: 0, completionPercentage: 0, aiStatus: "idle", activityCount: 0 }

  return (
    <div className="space-y-8">
      {/* Description Section */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <div className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
          {project.description ? (
            <p>{project.description}</p>
          ) : (
            <p className="italic">No description provided. Add one to help your team understand the goal of this research workspace.</p>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Workspace Statistics</h2>
        <ProjectStatsDisplay stats={stats} updatedAt={project.updatedAt} />
      </section>
    </div>
  )
}
