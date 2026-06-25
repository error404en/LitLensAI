"use client";

import { Inter } from "next/font/google";
import { StructuredLogger } from "../lib/ai/orchestrator/StructuredLogger";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log strictly as an unhandled global error
  if (typeof window !== "undefined") {
    // Client-side log
    console.error("Global Client Error:", error);
  } else {
    // Server-side structured log
    StructuredLogger.error("GLOBAL_UNHANDLED_EXCEPTION", error, { digest: error.digest });
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex items-center justify-center bg-background text-on-background p-4">
          <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl border border-outline">
            <div className="flex justify-center mb-6 text-error">
              <span className="material-symbols-outlined text-5xl">warning</span>
            </div>
            <h1 className="text-2xl font-bold text-center mb-4 text-on-surface">Critical System Error</h1>
            <p className="text-on-surface-variant text-center mb-8">
              We encountered an unexpected error. Our engineers have been notified.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full py-3 px-4 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 px-4 bg-surface-variant text-on-surface-variant rounded-xl font-medium hover:bg-surface-variant/80 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-error-container text-on-error-container text-xs rounded-lg overflow-auto">
                <p className="font-bold mb-2">Development Info (Hidden in Prod):</p>
                <p className="font-mono whitespace-pre-wrap break-all">{error.message}</p>
                {error.digest && <p className="mt-2 text-on-error-container/70">Digest: {error.digest}</p>}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
