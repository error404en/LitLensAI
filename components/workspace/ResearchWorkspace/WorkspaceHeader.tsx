import { Search, Settings, HelpCircle, Download } from "lucide-react";
import { useWorkspaceStore } from "../../../stores/workspace.store";
import { Project } from "../../../lib/types";

interface WorkspaceHeaderProps {
  project: Project | undefined;
}

export function WorkspaceHeader({ project }: WorkspaceHeaderProps) {
  const { searchQuery, setSearchQuery } = useWorkspaceStore();

  return (
    <div className="flex-none h-14 border-b bg-surface/50 backdrop-blur flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center space-x-4">
        <h1 className="font-semibold text-lg">{project?.title || "Research Workspace"}</h1>
        {project?.status === "active" && (
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
            Active
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3 flex-1 max-w-md ml-4 hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search papers, notes, or insights..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 bg-background border rounded-md pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors hidden sm:block">
          <Download className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
