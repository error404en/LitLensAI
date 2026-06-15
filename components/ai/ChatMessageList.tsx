import * as React from "react";
import { AIChatMessage } from "../../lib/types/ai";
import { ChatMessage } from "./ChatMessage";

interface ChatMessageListProps {
  messages: AIChatMessage[];
  onRegenerate?: () => void;
}

export function ChatMessageList({ messages, onRegenerate }: ChatMessageListProps) {
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg, idx) => (
        <ChatMessage 
          key={msg.id} 
          message={msg} 
          isLast={idx === messages.length - 1} 
          onRegenerate={onRegenerate} 
        />
      ))}
      <div ref={endOfMessagesRef} className="h-px w-full" />
    </div>
  );
}
