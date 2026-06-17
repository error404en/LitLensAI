import { Loader2 } from "lucide-react";

interface WorkspaceFooterProps {
  isProcessing?: boolean;
  message?: string;
}

export function WorkspaceFooter({ isProcessing = false, message = "System Idle" }: WorkspaceFooterProps) {
  return (
    <div className="flex-none h-8 border-t bg-surface flex items-center justify-between px-4 text-xs z-10 sticky bottom-0">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
        <span>{isProcessing ? 'Pipeline Active' : message}</span>
      </div>
      
      {isProcessing && (
        <div className="flex items-center text-yellow-600 dark:text-yellow-500">
          <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
          <span>Syncing workspace...</span>
        </div>
      )}
    </div>
  );
}
