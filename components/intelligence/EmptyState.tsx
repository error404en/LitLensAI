import { BookOpen } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = "No Data Available", 
  message = "There is no intelligence data to display yet.", 
  icon = <BookOpen className="h-8 w-8" />, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-xl bg-surface/50 border-dashed">
      <div className="h-12 w-12 text-muted-foreground/50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
