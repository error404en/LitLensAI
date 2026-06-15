import * as React from "react";
import { cn } from "../../lib/utils";
import { ChatCitation } from "./ChatCitation";
import { AICitation } from "../../lib/types/ai";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant" | "system" | "error" | "thinking";
  citations?: readonly AICitation[];
}

export function ChatBubble({ content, role, citations }: ChatBubbleProps) {
  const isUser = role === "user";
  const isError = role === "error";

  // Extremely basic markdown parser for paragraphs, bold, and mock citations
  // In a full implementation, use 'react-markdown' or 'marked'.
  const renderContent = () => {
    let text = content;
    
    // Split into paragraphs
    const paragraphs = text.split("\n\n").map((p, i) => {
      // Bold
      const boldParts = p.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <p key={i} className="mb-2 last:mb-0">
          {boldParts}
        </p>
      );
    });

    return paragraphs;
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words",
        isUser ? "bg-primary text-primary-foreground rounded-br-sm ml-auto" : "bg-muted/50 rounded-bl-sm",
        isError && "bg-destructive/10 text-destructive border border-destructive/20"
      )}
    >
      {renderContent()}
      
      {citations && citations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
          <p className="text-xs font-semibold opacity-70">Sources</p>
          {citations.map((c) => (
            <div key={c.id} className="text-xs flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer">
              <ChatCitation citation={c} />
              <span className="truncate">{c.paperTitle} {c.page && `(p. ${c.page})`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
