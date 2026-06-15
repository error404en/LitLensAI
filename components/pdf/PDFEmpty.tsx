import * as React from "react";
import { FileText } from "lucide-react";
import { EmptyState } from "../ui/empty-state";

export function PDFEmpty() {
  return (
    <EmptyState icon={FileText} title="No PDF loaded" description="Select a paper from your library to start reading and annotating." />
  );
}
