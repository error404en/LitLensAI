import * as React from "react";
import { AICitation } from "../../lib/types/ai";

interface ChatCitationProps {
  citation: AICitation;
}

export function ChatCitation({ citation }: ChatCitationProps) {
  return (
    <span 
      className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-medium cursor-pointer hover:bg-primary/20 transition-colors align-super ml-0.5"
      title={`Source: ${citation.paperTitle}${citation.page ? ` (Page ${citation.page})` : ''}`}
    >
      {citation.id.replace('cit_', '')}
    </span>
  );
}
