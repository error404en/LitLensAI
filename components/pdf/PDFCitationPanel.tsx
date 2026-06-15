import * as React from "react";
import { Paper } from "../../lib/types";
import { CitationFormat, PDFCitation } from "../../lib/types/pdf";
import { PDFService } from "../../services/pdf.service";
import { Button } from "../ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const FORMATS: { label: string; value: CitationFormat }[] = [
  { label: "APA", value: "apa" },
  { label: "IEEE", value: "ieee" },
  { label: "MLA", value: "mla" },
  { label: "Chicago", value: "chicago" },
  { label: "BibTeX", value: "bibtex" },
];

export function PDFCitationPanel({ paper }: { paper: Paper }) {
  const [activeFormat, setActiveFormat] = React.useState<CitationFormat>("apa");
  const [copied, setCopied] = React.useState(false);

  const citation = React.useMemo(
    () => PDFService.generateCitation(paper, activeFormat),
    [paper, activeFormat]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">Citation</h3>

      <div className="flex flex-wrap gap-1.5">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFormat(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              activeFormat === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative p-4 rounded-md border bg-muted/20 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
        {citation.text}
        <Button
          variant="ghost" size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={handleCopy}
          title="Copy citation"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}
