import * as React from "react";
import { HighlightColor } from "../../lib/types/pdf";
import { cn } from "../../lib/utils";
import { Highlighter, StickyNote, Copy, Quote, Sparkles } from "lucide-react";

const COLORS: { value: HighlightColor; class: string }[] = [
  { value: "yellow", class: "bg-yellow-400" },
  { value: "green", class: "bg-green-400" },
  { value: "blue", class: "bg-blue-400" },
  { value: "pink", class: "bg-pink-400" },
];

interface PDFSelectionMenuProps {
  x: number;
  y: number;
  selectedText: string;
  onHighlight: (color: HighlightColor) => void;
  onAddNote: () => void;
  onCopy: () => void;
  onCopyCitation: () => void;
  onAskAI: () => void;
  onClose: () => void;
}

export function PDFSelectionMenu({ x, y, selectedText, onHighlight, onAddNote, onCopy, onCopyCitation, onAskAI, onClose }: PDFSelectionMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-popover border border-border rounded-lg shadow-xl p-1.5 flex items-center gap-0.5 animate-in fade-in-0 zoom-in-95 duration-150"
      style={{ left: x, top: y }}
    >
      {/* Color highlights */}
      {COLORS.map((c) => (
        <button
          key={c.value}
          onClick={() => onHighlight(c.value)}
          className={cn("h-6 w-6 rounded-full transition-transform hover:scale-125 border-2 border-transparent hover:border-foreground/20", c.class)}
          title={`Highlight ${c.value}`}
          aria-label={`Highlight ${c.value}`}
        />
      ))}
      <div className="h-5 w-px bg-border mx-1" />
      <button onClick={onAddNote} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Add Note"><StickyNote className="h-4 w-4" /></button>
      <button onClick={onCopy} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Copy"><Copy className="h-4 w-4" /></button>
      <button onClick={onCopyCitation} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Copy as Citation"><Quote className="h-4 w-4" /></button>
      <div className="h-5 w-px bg-border mx-1" />
      <button onClick={onAskAI} className="p-1.5 rounded-md hover:bg-accent transition-colors text-primary" title="Ask AI"><Sparkles className="h-4 w-4" /></button>
    </div>
  );
}
