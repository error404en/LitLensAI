import * as React from "react"
import { Badge } from "../ui/badge"
import { PaperStatus } from "../../lib/types"

export function PaperStatusBadge({ status }: { status: PaperStatus }) {
  switch (status) {
    case "completed":
      return <Badge variant="success">Ready</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    case "queued":
    case "embedding":
    case "summarizing":
    case "processing":
      return <Badge variant="warning">Processing</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
