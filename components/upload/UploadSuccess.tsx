import * as React from "react";
import { CheckCircle, FolderPlus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { UploadFile } from "../../lib/types/upload";
import { safeFileSize } from "../../lib/utils";

interface UploadSuccessProps {
  upload: UploadFile;
  onViewPaper?: () => void;
  onAddToProject?: () => void;
  onUploadMore?: () => void;
}

export function UploadSuccess({ upload, onViewPaper, onAddToProject, onUploadMore }: UploadSuccessProps) {
  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Upload Complete</h3>
          <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs" title={upload.fileName}>
            {upload.fileName} ({safeFileSize(upload.fileSize)})
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <Button variant="default" size="sm" onClick={onViewPaper}>View Paper</Button>
          <Button variant="outline" size="sm" onClick={onAddToProject}>
            <FolderPlus className="mr-1.5 h-3.5 w-3.5" /> Add to Project
          </Button>
          <Button variant="ghost" size="sm" onClick={onUploadMore}>
            <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
