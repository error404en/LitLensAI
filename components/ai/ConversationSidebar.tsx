import * as React from "react";
import { useConversation } from "../../hooks/useConversation";
import { Button } from "../ui/button";
import { MessageSquare, MoreVertical, Pin, Trash2, Edit2, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { AIConversation } from "../../lib/types/ai";

interface ConversationSidebarProps {
  paperId: string;
}

export function ConversationSidebar({ paperId }: ConversationSidebarProps) {
  const { conversations, selectedConversationId, selectConversation, deleteConversation, togglePin, createConversation } = useConversation(paperId);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return conversations;
    return conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  const pinned = filtered.filter(c => c.isPinned);
  const recent = filtered.filter(c => !c.isPinned);

  const renderGroup = (title: string, list: AIConversation[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="px-3 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{title}</h4>
        <div className="space-y-0.5 px-2">
          {list.map(c => (
            <div
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={cn(
                "flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer group transition-colors",
                selectedConversationId === c.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span className="truncate">{c.title}</span>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); togglePin(c.id, c.isPinned); }}>
                  <Pin className={cn("h-3 w-3", c.isPinned && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-muted/10 border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full h-8 pl-8 pr-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        {renderGroup("Pinned", pinned)}
        {renderGroup("Recent", recent)}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6 px-4">No conversations found.</p>
        )}
      </div>
    </div>
  );
}
