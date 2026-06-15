import * as React from "react";
import { useChat } from "../../hooks/useChat";
import { useConversation } from "../../hooks/useConversation";
import { usePDFStore } from "../../stores/pdf.store";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { PromptTemplates } from "./PromptTemplates";
import { ContextCard } from "./ContextCard";
import { AIWelcome } from "./AIWelcome";
import { AIThinking } from "./AIThinking";
import { AIErrorState } from "./AIErrorState";
import { AIPromptTemplate } from "../../lib/types/ai";
import { ConversationSidebar } from "./ConversationSidebar";

const DEFAULT_TEMPLATES: AIPromptTemplate[] = [
  { id: "t1", label: "Summarize", prompt: "Summarize the key findings of this paper." },
  { id: "t2", label: "Methodology", prompt: "Explain the methodology used in this research." },
  { id: "t3", label: "Limitations", prompt: "What are the limitations mentioned by the authors?" },
];

interface ChatPanelProps {
  paperId: string;
  onClose?: () => void;
}

export function ChatPanel({ paperId, onClose }: ChatPanelProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [showHistory, setShowHistory] = React.useState(false);
  
  const { messages, isStreaming, isTyping, isLoading, error, sendMessage, regenerate } = useChat();
  const { conversations, selectedConversationId, createConversation } = useConversation(paperId);
  const { selectedText, currentPage } = usePDFStore();

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const title = selectedConversation?.title || "New Conversation";

  const handleSubmit = () => {
    if (!inputValue.trim() || isStreaming) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleSelectTemplate = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <ChatHeader 
        title={title} 
        onNewChat={() => createConversation()} 
        onClose={onClose}
        onToggleHistory={() => setShowHistory(!showHistory)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversation History */}
        {showHistory && (
          <aside className="w-64 shrink-0 flex flex-col hidden md:flex border-r border-border">
            <ConversationSidebar paperId={paperId} />
          </aside>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ContextCard 
            context={selectedText ? { paperId, selectedText: selectedText.text, selectedPage: selectedText.page } : null} 
          />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-sm text-muted-foreground animate-pulse">Loading conversation...</p>
            </div>
          ) : error && messages.length === 0 ? (
            <AIErrorState error={error} />
          ) : messages.length === 0 ? (
            <AIWelcome onSelectSuggestion={(p) => { setInputValue(p); handleSubmit(); }} />
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col relative">
               <ChatMessageList messages={messages} onRegenerate={regenerate} />
               {isTyping && !isStreaming && (
                 <div className="absolute bottom-4 left-4">
                   <AIThinking />
                 </div>
               )}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card shrink-0 space-y-2">
            <PromptTemplates templates={DEFAULT_TEMPLATES} onSelect={handleSelectTemplate} />
            <ChatInput 
              value={inputValue} 
              onChange={setInputValue} 
              onSubmit={handleSubmit} 
              isStreaming={isStreaming} 
              disabled={isLoading || isTyping} 
            />
            <p className="text-[10px] text-center text-muted-foreground opacity-70">
              AI Copilot can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
