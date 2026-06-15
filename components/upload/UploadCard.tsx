import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UploadFilePreview } from "./UploadFilePreview";
import { UploadProgress } from "./UploadProgress";
import { UploadFile } from "../../lib/types/upload";
import { RotateCcw, X, Ban } from "lucide-react";

interface UploadCardProps {
  upload: UploadFile;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function UploadCard({ upload, onRetry, onCancel, onRemove }: UploadCardProps) {
  const showProgress = ["uploading", "processing", "validating", "checking_duplicate"].includes(upload.status);
  const showRetry = upload.status === "failed";
  const showCancel = upload.status === "uploading" || upload.status === "queued";

  return (
    <Card className="group transition-all duration-200 hover:shadow-sm">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <UploadFilePreview
            fileName={upload.fileName}
            fileSize={upload.fileSize}
            status={upload.status}
            createdAt={upload.createdAt}
          />
          <div className="flex items-center gap-1 shrink-0">
            {showRetry && (
              <Button variant="ghost" size="icon" onClick={() => onRetry?.(upload.id)} title="Retry upload">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            {showCancel && (
              <Button variant="ghost" size="icon" onClick={() => onCancel?.(upload.id)} title="Cancel upload">
                <Ban className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove?.(upload.id)}
              title="Remove"
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showProgress && (
          <UploadProgress
            percentage={upload.progress}
            fileSize={upload.fileSize}
            status={upload.status}
          />
        )}

        {upload.error && (
          <p className="text-xs text-destructive mt-1">{upload.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
