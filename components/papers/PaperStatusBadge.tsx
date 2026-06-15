import * as React from "react"
import { Badge } from "../ui/badge"

export function PaperStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>
    case "processing":
    case "embedding":
    case "summarizing":
      return <Badge variant="warning" className="animate-pulse">Processing</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "queued":
    default:
      return <Badge variant="secondary">Queued</Badge>
  }
}
