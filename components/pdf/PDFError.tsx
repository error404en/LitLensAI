import * as React from "react";
import { ErrorState } from "../ui/error-state";

export function PDFError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <ErrorState title="Failed to load PDF" description={message} onRetry={onRetry} />
    </div>
  );
}
