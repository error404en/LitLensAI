import * as React from "react";
import { UploadFile } from "../../lib/types/upload";
import { UploadCard } from "./UploadCard";

interface UploadQueueProps {
  uploads: UploadFile[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function UploadQueue({ uploads, onRetry, onCancel, onRemove }: UploadQueueProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Upload Queue ({uploads.length})
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        {uploads.map((upload) => (
          <UploadCard
            key={upload.id}
            upload={upload}
            onRetry={onRetry}
            onCancel={onCancel}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
