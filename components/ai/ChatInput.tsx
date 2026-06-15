import * as React from "react";
import { Button } from "../ui/button";
import { ArrowUp, StopCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isStreaming, disabled }: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isStreaming) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-end w-full border rounded-xl bg-background focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-sm">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about this paper..."
        className="w-full min-h-[44px] max-h-[200px] py-3 pl-4 pr-12 resize-none bg-transparent border-0 focus-visible:ring-0 shadow-none text-sm"
        disabled={disabled}
        aria-label="Chat input"
      />
      <div className="absolute right-2 bottom-2">
        {isStreaming ? (
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg" aria-label="Stop generating">
            <StopCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            onClick={onSubmit} 
            disabled={!value.trim() || disabled} 
            className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
