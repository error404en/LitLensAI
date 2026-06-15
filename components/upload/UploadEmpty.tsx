import * as React from "react";
import { Upload } from "lucide-react";
import { EmptyState } from "../ui/empty-state";

export function UploadEmpty() {
  return (
    <EmptyState
      icon={Upload}
      title="No uploads yet"
      description="Drag PDFs above to get started, or click 'Browse Files' to select from your computer."
    />
  );
}
