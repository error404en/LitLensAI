"use client";

import { PDFError } from "../../../../components/pdf/PDFError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <PDFError message={error.message || "Failed to load PDF workspace"} onRetry={reset} />;
}
