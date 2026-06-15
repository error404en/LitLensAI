import * as React from "react";
import { FileText } from "lucide-react";
import { safeFileSize } from "../../lib/utils";
import { UploadStatusBadge } from "./UploadStatusBadge";
import { UploadStatus } from "../../lib/types/upload";

interface UploadFilePreviewProps {
  fileName: string;
  fileSize: number;
  status: UploadStatus;
  createdAt: string;
}

export function UploadFilePreview({ fileName, fileSize, status, createdAt }: UploadFilePreviewProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
        <FileText className="h-5 w-5 text-red-500" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <p className="text-sm font-medium truncate" title={fileName}>{fileName}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{safeFileSize(fileSize)}</span>
          <span>•</span>
          <UploadStatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
