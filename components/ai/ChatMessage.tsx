import * as React from "react";
import { AIChatMessage } from "../../lib/types/ai";
import { ChatBubble } from "./ChatBubble";
import { AIActionBar } from "./AIActionBar";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: AIChatMessage;
  isLast?: boolean;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, isLast, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex gap-3 w-full group ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 w-full max-w-full min-w-0 ${isUser ? "items-end" : "items-start"}`}>
        <ChatBubble content={message.content} role={message.role} citations={message.citations} />
        {!isUser && message.role !== "error" && !message.isStreaming && (
          <AIActionBar onCopy={handleCopy} onRegenerate={onRegenerate} isLast={isLast} />
        )}
      </div>
    </div>
  );
}
