import * as React from "react";
import { AlertCircle, RotateCcw, X, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface UploadErrorProps {
  fileName: string;
  error: string;
  onRetry?: () => void;
  onRemove?: () => void;
}

export function UploadError({ fileName, error, onRetry, onRemove }: UploadErrorProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" title={fileName}>{fileName}</p>
          <p className="text-xs text-destructive mt-1">{error}</p>
          <div className="flex items-center gap-2 mt-3">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retry
              </Button>
            )}
            {onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove}>
                <X className="mr-1.5 h-3.5 w-3.5" /> Remove
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground" disabled>
              <Flag className="mr-1.5 h-3.5 w-3.5" /> Report Issue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
