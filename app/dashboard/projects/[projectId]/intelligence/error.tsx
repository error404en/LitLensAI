"use client";

import { useEffect } from "react";
import { ErrorState } from "../../../../../components/intelligence/ErrorState";

export default function IntelligenceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Intelligence Hub Error:", error);
  }, [error]);

  return <ErrorState onRetry={() => reset()} />;
}
