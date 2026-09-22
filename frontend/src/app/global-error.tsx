"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white flex min-h-screen flex-col items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-2xl font-light tracking-wide text-neutral-100">Something went wrong</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            An unexpected error occurred. Our engineering team has been notified automatically.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors uppercase tracking-wider text-xs"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
