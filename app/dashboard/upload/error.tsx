"use client";

import { ErrorState } from "../../../components/ui/error-state";

export default function UploadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
      <ErrorState
        title="Upload Pipeline Error"
        description={error.message || "Something went wrong with the upload pipeline."}
        onRetry={reset}
      />
    </div>
  );
}
