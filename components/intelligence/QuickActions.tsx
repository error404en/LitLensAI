import { Bot, GitCompare, FileText, Share } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button className="flex flex-col items-center justify-center p-4 bg-surface border rounded-xl hover:bg-muted transition-colors group">
        <Bot className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium">Ask AI</span>
      </button>
      
      <button className="flex flex-col items-center justify-center p-4 bg-surface border rounded-xl hover:bg-muted transition-colors group">
        <FileText className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium">Review</span>
      </button>
      
      <button className="flex flex-col items-center justify-center p-4 bg-surface border rounded-xl hover:bg-muted transition-colors group">
        <GitCompare className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium">Compare</span>
      </button>
      
      <button className="flex flex-col items-center justify-center p-4 bg-surface border rounded-xl hover:bg-muted transition-colors group">
        <Share className="h-5 w-5 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium">Export</span>
      </button>
    </div>
  );
}
