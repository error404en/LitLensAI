import * as React from "react";
import { Button } from "../ui/button";
import { MessageSquarePlus, PanelRightClose, MoreHorizontal } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  onNewChat: () => void;
  onClose?: () => void;
  onToggleHistory?: () => void;
}

export function ChatHeader({ title, onNewChat, onClose, onToggleHistory }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {onToggleHistory && (
          <Button variant="ghost" size="icon" onClick={onToggleHistory} title="Toggle History" aria-label="Toggle History" className="mr-1 h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-sm font-semibold truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat" aria-label="New Chat" className="h-8 w-8">
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} title="Close AI Panel" aria-label="Close AI Panel" className="h-8 w-8">
            <PanelRightClose className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
