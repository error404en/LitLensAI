import * as React from "react";
import { Badge } from "../ui/badge";
import { UploadStatus } from "../../lib/types/upload";

const statusConfig: Record<UploadStatus, { label: string; variant: string; pulse?: boolean }> = {
  pending: { label: "Pending", variant: "secondary" },
  validating: { label: "Validating", variant: "warning", pulse: true },
  checking_duplicate: { label: "Checking", variant: "warning", pulse: true },
  queued: { label: "Queued", variant: "secondary" },
  uploading: { label: "Uploading", variant: "warning", pulse: true },
  processing: { label: "Processing", variant: "warning", pulse: true },
  completed: { label: "Completed", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

export function UploadStatusBadge({ status }: { status: UploadStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      variant={config.variant as "secondary" | "success" | "destructive" | "outline" | "warning"}
      className={config.pulse ? "animate-pulse" : ""}
    >
      {config.label}
    </Badge>
  );
}
