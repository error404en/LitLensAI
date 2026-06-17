import { ProjectHealthMetrics } from "../../services/project-health.service";

interface ProjectHealthProps {
  health: ProjectHealthMetrics | undefined;
}

export function ProjectHealth({ health }: ProjectHealthProps) {
  if (!health) return null;

  return (
    <div className="bg-surface border rounded-xl p-4">
      <h3 className="font-semibold text-sm mb-4">Project Health</h3>
      
      <div className="space-y-4">
        {/* Knowledge Coverage */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Knowledge Coverage</span>
            <span className="font-medium">{health.knowledgeCoverage}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${health.knowledgeCoverage}%` }}
            />
          </div>
        </div>

        {/* Processing Completion */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Processing Completion</span>
            <span className="font-medium">{health.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500 ease-out" 
              style={{ width: `${health.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
