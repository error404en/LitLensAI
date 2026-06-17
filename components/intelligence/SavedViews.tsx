import { Clock, Star, Mail, Edit3, Bot, Archive } from "lucide-react";
import { useIntelligenceStore, IntelligenceView } from "../../stores/intelligence.store";

export function SavedViews() {
  const { savedView, setSavedView } = useIntelligenceStore();

  const views: { id: IntelligenceView; label: string; icon: React.ReactNode }[] = [
    { id: "recent", label: "Recent Activity", icon: <Clock className="h-4 w-4" /> },
    { id: "favorites", label: "Favorites", icon: <Star className="h-4 w-4" /> },
    { id: "unread", label: "Unread Papers", icon: <Mail className="h-4 w-4" /> },
    { id: "annotated", label: "Annotated", icon: <Edit3 className="h-4 w-4" /> },
    { id: "ai_ready", label: "AI Ready", icon: <Bot className="h-4 w-4" /> },
    { id: "archived", label: "Archived", icon: <Archive className="h-4 w-4" /> },
  ];

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
        Views
      </h3>
      <nav className="space-y-1">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setSavedView(view.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
              savedView === view.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
