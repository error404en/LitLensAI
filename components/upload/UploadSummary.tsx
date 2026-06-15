import * as React from "react";
import { UploadSummary as UploadSummaryType } from "../../lib/types/upload";
import { Card, CardContent } from "../ui/card";
import { safeFileSize } from "../../lib/utils";
import { Upload, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

export function UploadSummary({ summary }: { summary: UploadSummaryType }) {
  if (summary.total === 0) return null;

  const stats = [
    { label: "Total", value: summary.total, icon: Upload, color: "text-foreground" },
    { label: "Completed", value: summary.completed, icon: CheckCircle, color: "text-green-500" },
    { label: "Processing", value: summary.processing + summary.uploading, icon: Loader2, color: "text-amber-500" },
    { label: "Queued", value: summary.queued, icon: Clock, color: "text-muted-foreground" },
    { label: "Failed", value: summary.failed, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Summary</h3>
          <span className="text-xs text-muted-foreground">{safeFileSize(summary.uploadedBytes)} / {safeFileSize(summary.totalBytes)}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color} shrink-0`} />
              <div className="flex flex-col">
                <span className="text-lg font-bold tabular-nums">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
