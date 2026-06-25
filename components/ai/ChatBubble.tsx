import * as React from "react";
import { cn } from "../../lib/utils";
import { ChatCitation } from "./ChatCitation";
import { AICitation } from "../../lib/types/ai";
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant" | "system" | "error" | "thinking";
  citations?: readonly AICitation[];
}

export function ChatBubble({ content, role, citations }: ChatBubbleProps) {
  const isUser = role === "user";
  const isError = role === "error";

  const text = isUser ? content : (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words",
        isUser ? "bg-primary text-primary-foreground rounded-br-sm ml-auto" : "bg-muted/50 rounded-bl-sm",
        isError && "bg-destructive/10 text-destructive border border-destructive/20"
      )}
    >
      {text}
      
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
