import { FileText, MessageSquare, GitCompare, BookOpen, Sparkles } from "lucide-react";
import { useActionCenter } from "../../../hooks/useActionCenter";
import { useRouter } from "next/navigation";

interface ActionCenterProps {
  projectId: string;
}

export function ActionCenter({ projectId }: ActionCenterProps) {
  const { data: _actions } = useActionCenter(projectId);
  const router = useRouter();

  return (
    <div className="bg-surface border rounded-xl p-4 sticky top-4">
      <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Action Center</h3>
      
      <div className="space-y-2">
        <button 
          onClick={() => router.push(`/dashboard/projects/${projectId}?tab=papers`)}
          className="w-full flex items-center p-3 text-sm text-left rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <BookOpen className="h-4 w-4 mr-3" />
          <div className="flex flex-col">
            <span className="font-medium">Continue Reading</span>
            <span className="text-xs opacity-80">Resume your last paper</span>
          </div>
        </button>

        <button 
          onClick={() => router.push(`/dashboard/projects/${projectId}?tab=chat`)}
          className="w-full flex items-center p-3 text-sm text-left rounded-lg hover:bg-muted transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-3 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">Resume AI Session</span>
            <span className="text-xs text-muted-foreground">Continue where you left off</span>
          </div>
        </button>

        <button 
          onClick={() => router.push(`/dashboard/projects/${projectId}?tab=compare`)}
          className="w-full flex items-center p-3 text-sm text-left rounded-lg hover:bg-muted transition-colors"
        >
          <GitCompare className="h-4 w-4 mr-3 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">Compare Papers</span>
            <span className="text-xs text-muted-foreground">Contrast methodologies</span>
          </div>
        </button>

        <button 
          onClick={() => router.push(`/dashboard/projects/${projectId}?tab=chat`)}
          className="w-full flex items-center p-3 text-sm text-left rounded-lg hover:bg-muted transition-colors"
        >
          <Sparkles className="h-4 w-4 mr-3 text-purple-500" />
          <div className="flex flex-col">
            <span className="font-medium">Generate Review</span>
            <span className="text-xs text-muted-foreground">Draft literature survey</span>
          </div>
        </button>
        
        <button 
          onClick={() => router.push(`/dashboard/projects/${projectId}?tab=notes`)}
          className="w-full flex items-center p-3 text-sm text-left rounded-lg hover:bg-muted transition-colors"
        >
          <FileText className="h-4 w-4 mr-3 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">Open Notes</span>
            <span className="text-xs text-muted-foreground">Review your highlights</span>
          </div>
        </button>
      </div>
    </div>
  );
}
