import * as React from "react";
import { cn } from "../../lib/utils";

interface UploadProgressProps {
  percentage: number;
  fileSize: number;
  status: string;
  className?: string;
}

export function UploadProgress({ percentage, fileSize, status, className }: UploadProgressProps) {
  const isActive = status === "uploading";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-muted-foreground capitalize">{status === "uploading" ? "Uploading..." : status}</span>
        <span className="font-semibold tabular-nums">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            isActive && "bg-primary",
            status === "completed" && "bg-green-500",
            status === "failed" && "bg-destructive",
            status === "processing" && "bg-amber-500 animate-pulse",
            !["uploading", "completed", "failed", "processing"].includes(status) && "bg-muted-foreground/30"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
