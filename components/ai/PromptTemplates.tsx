import * as React from "react";
import { AIPromptTemplate } from "../../lib/types/ai";
import { Button } from "../ui/button";

interface PromptTemplatesProps {
  templates: AIPromptTemplate[];
  onSelect: (prompt: string) => void;
}

export function PromptTemplates({ templates, onSelect }: PromptTemplatesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {templates.map((t) => (
        <Button
          key={t.id}
          variant="outline"
          size="sm"
          className="text-xs shrink-0 rounded-full bg-background"
          onClick={() => onSelect(t.prompt)}
          title={t.description}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
