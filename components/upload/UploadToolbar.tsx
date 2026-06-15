import * as React from "react";
import { Button } from "../ui/button";
import { UploadActions } from "./UploadActions";
import { Upload } from "lucide-react";

interface UploadToolbarProps {
  hasCompleted: boolean;
  hasUploads: boolean;
  onClearCompleted?: () => void;
  onClearAll?: () => void;
  onBrowse?: () => void;
}

export function UploadToolbar({ hasCompleted, hasUploads, onClearCompleted, onClearAll, onBrowse }: UploadToolbarProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm flex items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">Upload Pipeline</h2>
        <p className="text-sm text-muted-foreground">Drag papers below or browse to start uploading.</p>
      </div>
      <div className="flex items-center gap-2">
        <UploadActions
          hasCompleted={hasCompleted}
          hasUploads={hasUploads}
          onClearCompleted={onClearCompleted}
          onClearAll={onClearAll}
        />
        <Button size="sm" onClick={onBrowse}>
          <Upload className="mr-1.5 h-4 w-4" /> Browse Files
        </Button>
      </div>
    </div>
  );
}
