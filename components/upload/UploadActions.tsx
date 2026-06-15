import * as React from "react";
import { Button } from "../ui/button";
import { Trash2, CheckCircle } from "lucide-react";

interface UploadActionsProps {
  hasCompleted: boolean;
  hasUploads: boolean;
  onClearCompleted?: () => void;
  onClearAll?: () => void;
}

export function UploadActions({ hasCompleted, hasUploads, onClearCompleted, onClearAll }: UploadActionsProps) {
  if (!hasUploads) return null;

  return (
    <div className="flex items-center gap-2">
      {hasCompleted && (
        <Button variant="ghost" size="sm" onClick={onClearCompleted} className="text-muted-foreground">
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Clear Completed
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={onClearAll} className="text-muted-foreground hover:text-destructive">
        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear All
      </Button>
    </div>
  );
}
