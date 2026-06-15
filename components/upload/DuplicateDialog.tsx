import * as React from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { FileText, ExternalLink, Replace, X } from "lucide-react";

interface DuplicateDialogProps {
  isOpen: boolean;
  fileName: string;
  onOpenExisting?: () => void;
  onReplace?: () => void;
  onCancel?: () => void;
}

export function DuplicateDialog({ isOpen, fileName, onOpenExisting, onReplace, onCancel }: DuplicateDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => onCancel?.()}
      title="Duplicate Paper Detected"
      description={`"${fileName}" already exists in your library.`}
    >
      <div className="flex flex-col gap-4 mt-6">
        <div className="p-4 rounded-lg border bg-muted/30 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">Already in your papers library</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start" onClick={onOpenExisting}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open Existing Paper
          </Button>
          <Button variant="outline" className="justify-start" onClick={onReplace}>
            <Replace className="mr-2 h-4 w-4" /> Replace with New Version
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel Upload
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
