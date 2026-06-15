import * as React from "react"
import { Badge } from "../ui/badge"

export function ProjectStatusBadge({ status, aiStatus }: { status: string, aiStatus?: "idle" | "processing" | "ready" }) {
  if (status === "archived") {
    return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
  }
  
  if (aiStatus === "processing") {
    return <Badge variant="warning" className="animate-pulse">AI Processing</Badge>
  }
  
  return <Badge variant="success">Active</Badge>
}
