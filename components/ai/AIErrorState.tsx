import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

export function AIErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold text-destructive">Connection Error</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">{error}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
